import { useState } from "react";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useToast } from "@/hooks/use-toast";
import { apiRequest } from "@/lib/queryClient";

interface Patient {
  id: string;
  name: string;
  patientId: string;
  currentWardId?: string;
}

interface Ward {
  id: string;
  name: string;
  type: string;
  totalBeds: number;
  occupiedBeds: number;
}

interface TransferDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  selectedPatient?: Patient | null;
  wards: Ward[];
  onTransferCreated: () => void;
}

export default function TransferDialog({ 
  open, 
  onOpenChange, 
  selectedPatient, 
  wards, 
  onTransferCreated 
}: TransferDialogProps) {
  const [toWardId, setToWardId] = useState<string>("");
  const [reason, setReason] = useState<string>("");
  const [handoverNotes, setHandoverNotes] = useState<string>("");
  
  const { toast } = useToast();
  const queryClient = useQueryClient();

  const createTransferMutation = useMutation({
    mutationFn: async (transferData: any) => {
      return await apiRequest("POST", "/api/transfers", transferData);
    },
    onSuccess: () => {
      toast({
        title: "Transfer Request Created",
        description: "The transfer request has been submitted successfully.",
        variant: "default",
      });
      queryClient.invalidateQueries({ queryKey: ["/api/transfers"] });
      queryClient.invalidateQueries({ queryKey: ["/api/transfers/recent"] });
      resetForm();
      onTransferCreated();
    },
    onError: (error: Error) => {
      toast({
        title: "Error",
        description: error.message || "Failed to create transfer request.",
        variant: "destructive",
      });
    },
  });

  const resetForm = () => {
    setToWardId("");
    setReason("");
    setHandoverNotes("");
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!selectedPatient || !toWardId) {
      toast({
        title: "Missing Information",
        description: "Please select a patient and destination ward.",
        variant: "destructive",
      });
      return;
    }

    if (selectedPatient.currentWardId === toWardId) {
      toast({
        title: "Invalid Transfer",
        description: "Patient is already in the selected ward.",
        variant: "destructive",
      });
      return;
    }

    createTransferMutation.mutate({
      patientId: selectedPatient.id,
      fromWardId: selectedPatient.currentWardId,
      toWardId,
      reason,
      handoverNotes,
    });
  };

  const getWardColor = (wardType: string) => {
    switch (wardType) {
      case "ICU": return "ward-red";
      case "Non-ICU": return "ward-blue";
      case "TB Wing": return "ward-green";
      case "Backside": return "ward-orange";
      default: return "gray";
    }
  };

  const getAvailableBeds = (ward: Ward) => {
    return ward.totalBeds - ward.occupiedBeds;
  };

  const currentWard = selectedPatient ? wards.find(w => w.id === selectedPatient.currentWardId) : null;
  const availableWards = wards.filter(w => w.id !== selectedPatient?.currentWardId);

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle className="flex items-center space-x-2">
            <i className="fas fa-exchange-alt text-medical-blue-600"></i>
            <span>Patient Transfer Request</span>
          </DialogTitle>
        </DialogHeader>
        
        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Patient Information */}
          {selectedPatient && (
            <div className="p-4 bg-gray-50 rounded-lg">
              <div className="flex items-center space-x-3">
                <div className="w-10 h-10 bg-medical-blue-100 rounded-full flex items-center justify-center">
                  <span className="text-medical-blue-600 font-semibold text-sm">
                    {selectedPatient.name.charAt(0)}
                  </span>
                </div>
                <div>
                  <p className="font-medium text-gray-900">{selectedPatient.name}</p>
                  <p className="text-sm text-gray-600">ID: {selectedPatient.patientId}</p>
                  {currentWard && (
                    <p className="text-xs text-gray-500">
                      Current Ward: <span className={`font-medium text-${getWardColor(currentWard.type)}`}>
                        {currentWard.name}
                      </span>
                    </p>
                  )}
                </div>
              </div>
            </div>
          )}

          {/* Destination Ward */}
          <div className="space-y-2">
            <Label htmlFor="toWard">Transfer To Ward</Label>
            <Select value={toWardId} onValueChange={setToWardId} required>
              <SelectTrigger>
                <SelectValue placeholder="Select destination ward" />
              </SelectTrigger>
              <SelectContent>
                {availableWards.map((ward) => {
                  const availableBeds = getAvailableBeds(ward);
                  const isAvailable = availableBeds > 0;
                  
                  return (
                    <SelectItem 
                      key={ward.id} 
                      value={ward.id}
                      disabled={!isAvailable}
                    >
                      <div className="flex items-center justify-between w-full">
                        <div className="flex items-center space-x-2">
                          <span className={`w-3 h-3 bg-${getWardColor(ward.type)} rounded-full`}></span>
                          <span>{ward.name}</span>
                        </div>
                        <span className={`text-xs ${isAvailable ? 'text-green-600' : 'text-red-600'}`}>
                          {availableBeds} beds available
                        </span>
                      </div>
                    </SelectItem>
                  );
                })}
              </SelectContent>
            </Select>
          </div>

          {/* Transfer Reason */}
          <div className="space-y-2">
            <Label htmlFor="reason">Reason for Transfer</Label>
            <Textarea
              id="reason"
              placeholder="Enter the medical reason for this transfer..."
              value={reason}
              onChange={(e) => setReason(e.target.value)}
              className="min-h-[80px]"
              required
            />
          </div>

          {/* Handover Notes */}
          <div className="space-y-2">
            <Label htmlFor="handoverNotes">Handover Notes</Label>
            <Textarea
              id="handoverNotes"
              placeholder="Any important information for the receiving ward..."
              value={handoverNotes}
              onChange={(e) => setHandoverNotes(e.target.value)}
              className="min-h-[100px]"
            />
          </div>

          {/* Submit Button */}
          <div className="flex justify-end space-x-3">
            <Button 
              type="button" 
              variant="outline" 
              onClick={() => onOpenChange(false)}
              disabled={createTransferMutation.isPending}
            >
              Cancel
            </Button>
            <Button 
              type="submit" 
              className="medical-gradient text-white"
              disabled={createTransferMutation.isPending}
            >
              {createTransferMutation.isPending ? (
                <>
                  <i className="fas fa-spinner animate-spin mr-2"></i>
                  Creating...
                </>
              ) : (
                <>
                  <i className="fas fa-paper-plane mr-2"></i>
                  Submit Transfer Request
                </>
              )}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}
