import React from "react";

const PosterSkeleton: React.FC = () => {
    return (
        <div className="relative w-[250px] h-[355px] rounded-[15px] overflow-hidden bg-[#ccc] animate-pulse">
            {/* Перебегающий градиент поверх фона */}
            <div className="absolute inset-0 bg-gradient-to-r from-[#ddd] via-[#eee] to-[#ddd] animate-pulse" />

            {/* Тёмный текстбокс справа снизу */}
            <div className="absolute bottom-[10px] right-[10px] w-[150px] h-[50px] bg-[#ссс] bg-opacity-[0.8] rounded-[10px] p-[8px] flex flex-col justify-items-end space-y-[4px]">
                {/* Имитация текста */}
                <div className="w-[80%] h-[8px] bg-[#555] rounded-[4px]" />
                <div className="w-[60%] h-[8px] bg-[#555] rounded-[4px]" />
            </div>
        </div>
    );
};

export default PosterSkeleton;
