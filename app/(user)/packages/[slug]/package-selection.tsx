"use client";

import { useState } from "react";
import { Checkbox } from "@/components/ui/checkbox";

interface Price {
  id: number;
  duration: number;
  price: number;
}

interface PackageSelectionProps {
  prices: Price[];
  defaultPrice: number;
}

export function PackageSelection({ prices, defaultPrice }: PackageSelectionProps) {
  const [selectedPriceId, setSelectedPriceId] = useState<number | null>(null);
  const [totalPrice, setTotalPrice] = useState<number>(defaultPrice);

  const handlePriceSelect = (priceId: number, price: number) => {
    // If already selected, do nothing (can't deselect)
    if (selectedPriceId === priceId) return;

    // Set the new selected price
    setSelectedPriceId(priceId);
    setTotalPrice(price);
  };

  return (
    <>
      <div className="mb-8">
        <div className="font-semibold text-[#000000] text-xl md:text-2xl mb-3">Thời gian</div>
        <div className="flex items-center flex-wrap gap-y-[30px] gap-x-[52px]">
          {prices.map((price) => (
            <div className="flex items-center gap-[14px]" key={price.id}>
              <Checkbox 
                className="w-8 h-8 border-[#737373]" 
                checked={selectedPriceId === price.id}
                onCheckedChange={() => handlePriceSelect(price.id, price.price)}
              />
              <div className="text-base md:text-xl text-[#737373]">{price.duration} tháng</div>
            </div>
          ))}
        </div>
      </div>

      <div className="flex items-center justify-between mb-8">
        <div className="font-semibold text-[#000000] text-xl md:text-2xl">Tổng tiền</div>
        <div className="text-[#00C7BE] font-semibold text-2xl">{totalPrice.toLocaleString()} vnđ</div>
      </div>
    </>
  );
}
