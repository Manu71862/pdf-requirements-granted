import { domains } from "@/lib/domains";
import { Card, CardContent } from "@/components/ui/card";
import { motion } from "framer-motion";

interface DomainSelectorProps {
  selected: string;
  onSelect: (id: string) => void;
}

export function DomainSelector({ selected, onSelect }: DomainSelectorProps) {
  return (
    <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-2">
      {domains.map((d, i) => (
        <motion.div
          key={d.id}
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: i * 0.03 }}
        >
          <Card
            className={`cursor-pointer transition-all hover:shadow-md h-full ${
              selected === d.id
                ? "ring-2 ring-primary shadow-glow bg-primary/5"
                : "hover:border-primary/30"
            }`}
            onClick={() => onSelect(d.id)}
          >
            <CardContent className="flex flex-col items-center gap-1.5 p-3 text-center">
              <d.icon className={`w-5 h-5 ${selected === d.id ? "text-primary" : "text-muted-foreground"}`} />
              <span className="font-medium text-xs leading-tight">{d.label}</span>
            </CardContent>
          </Card>
        </motion.div>
      ))}
    </div>
  );
}
