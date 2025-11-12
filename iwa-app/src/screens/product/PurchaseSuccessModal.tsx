import { Check } from 'lucide-react';

interface PurchaseSuccessModalProps {
  onClose: () => void;
}

export function PurchaseSuccessModal({ onClose }: PurchaseSuccessModalProps) {
  return (
    <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
      <div className="w-full max-w-sm bg-white rounded-3xl overflow-hidden flex flex-col">
        {/* Content */}
        <div className="px-6 py-12 text-center">
          <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-6">
            <Check className="w-10 h-10 text-green-600" />
          </div>
          <h2 className="text-xl text-foreground mb-3">Achat validé !</h2>
          <p className="text-sm text-muted-foreground mb-8">
            Votre commande a été confirmée avec succès. Vous recevrez bientôt une notification avec les détails de livraison.
          </p>
          <button 
            onClick={onClose}
            className="w-full bg-[#7BCCEB] text-white py-3.5 rounded-xl hover:bg-[#5BB8E0] transition-colors"
          >
            Continuer
          </button>
        </div>
      </div>
    </div>
  );
}

export default PurchaseSuccessModal;