import { X, Star } from 'lucide-react';
import { Product } from '../../shared/types';
import { ImageWithFallback } from '../../figma/ImageWithFallBack';

interface PurchaseConfirmationModalProps {
  product: Product;
  onClose: () => void;
  onConfirm: () => void;
}

export function PurchaseConfirmationModal({ product, onClose, onConfirm }: PurchaseConfirmationModalProps) {
  // Calculate prices
  const priceValue = parseFloat(product.price.replace(',', '.').replace(' €', ''));
  const commission = priceValue * 0.10;
  const total = priceValue + commission;

  const formatPrice = (value: number) => {
    return value.toFixed(2).replace('.', ',') + ' €';
  };

  const renderStars = (rating: number) => {
    return Array.from({ length: 5 }).map((_, index) => (
      <Star
        key={index}
        className={`w-3 h-3 ${
          index < rating ? 'fill-yellow-400 text-yellow-400' : 'text-gray-300'
        }`}
      />
    ));
  };

  return (
    <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
      <div className="w-full max-w-md bg-white rounded-3xl overflow-hidden flex flex-col max-h-[90vh]">
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-border">
          <h2 className="text-base text-foreground">Confirmation d'achat</h2>
          <button onClick={onClose} className="w-8 h-8 flex items-center justify-center">
            <X className="w-5 h-5 text-gray-800" />
          </button>
        </div>

        {/* Content */}
        <div className="flex-1 overflow-y-auto px-6 py-6">
          {/* Product info */}
          <div className="mb-6">
            <h3 className="text-sm text-foreground mb-3">Article</h3>
            <div className="flex items-center gap-3">
              <ImageWithFallback
                src={product.images[0]}
                alt={product.name}
                className="w-20 h-20 rounded-lg object-cover flex-shrink-0"
              />
              <div className="flex-1">
                <h4 className="text-sm text-foreground mb-1">{product.name}</h4>
                <p className="text-xs text-muted-foreground">{product.quantity}</p>
              </div>
            </div>
          </div>

          {/* Seller info */}
          <div className="mb-6">
            <h3 className="text-sm text-foreground mb-3">Vendeur</h3>
            <div className="flex items-center gap-3">
              <ImageWithFallback
                src={product.seller.avatar}
                alt={product.seller.username}
                className="w-12 h-12 rounded-full object-cover flex-shrink-0"
              />
              <div className="flex-1">
                <h4 className="text-sm text-foreground mb-1">{product.seller.username}</h4>
                <div className="flex items-center gap-1">
                  {renderStars(product.seller.rating)}
                  <span className="text-xs text-muted-foreground ml-1">
                    ({product.seller.reviewCount})
                  </span>
                </div>
              </div>
            </div>
          </div>

          {/* Price breakdown */}
          <div className="bg-gray-50 rounded-xl p-4">
            <div className="flex justify-between items-center mb-3">
              <span className="text-sm text-muted-foreground">Prix de vente</span>
              <span className="text-sm text-foreground">{product.price}</span>
            </div>
            <div className="flex justify-between items-center mb-3">
              <span className="text-sm text-muted-foreground">Commission (10%)</span>
              <span className="text-sm text-foreground">{formatPrice(commission)}</span>
            </div>
            <div className="pt-3 border-t border-border">
              <div className="flex justify-between items-center">
                <span className="text-base text-foreground">Total</span>
                <span className="text-base text-foreground">{formatPrice(total)}</span>
              </div>
            </div>
          </div>
        </div>

        {/* Confirm button */}
        <div className="px-6 py-4 border-t border-border">
          <button 
            onClick={onConfirm}
            className="w-full bg-[#7BCCEB] text-white py-3.5 rounded-xl hover:bg-[#5BB8E0] transition-colors"
          >
            Valider l'achat
          </button>
        </div>
      </div>
    </div>
  );
}

export default PurchaseConfirmationModal;