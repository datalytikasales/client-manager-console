import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { FileText } from "lucide-react";

export default function TransactionsReport() {
  return (
    <div className="space-y-6 p-8 animate-fade-in">
      <div className="flex justify-between items-center">
        <h1 className="text-3xl font-bold">Transactions Report</h1>
        <div className="space-x-4">
          <Button variant="outline">
            <FileText className="w-4 h-4 mr-2" />
            Export Excel
          </Button>
          <Button variant="outline">
            <FileText className="w-4 h-4 mr-2" />
            Export PDF
          </Button>
        </div>
      </div>

      <Card className="p-6">
        <p className="text-center text-muted-foreground">
          Transactions report functionality coming soon...
        </p>
      </Card>
    </div>
  );
}