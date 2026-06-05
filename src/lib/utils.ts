import { type ClassValue, clsx } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function animateFlyToCart(e: React.MouseEvent, imgSrc: string) {
  // Tìm nút bấm (start point) và biểu tượng giỏ hàng (end point)
  const button = e.currentTarget as HTMLElement;
  const cartIcon = document.getElementById("cart-icon");

  if (!button || !cartIcon) return;

  const btnRect = button.getBoundingClientRect();
  const cartRect = cartIcon.getBoundingClientRect();

  // Tạo phần tử bay
  const flyingImg = document.createElement("img");
  flyingImg.src = imgSrc;
  flyingImg.style.position = "fixed";
  flyingImg.style.top = `${btnRect.top}px`;
  flyingImg.style.left = `${btnRect.left + btnRect.width / 2 - 25}px`;
  flyingImg.style.width = "50px";
  flyingImg.style.height = "50px";
  flyingImg.style.objectFit = "cover";
  flyingImg.style.borderRadius = "50%";
  flyingImg.style.zIndex = "9999";
  flyingImg.style.transition = "all 0.8s cubic-bezier(0.2, 0.8, 0.2, 1)";
  flyingImg.style.boxShadow = "0 10px 25px rgba(0,0,0,0.2)";
  flyingImg.style.pointerEvents = "none";

  document.body.appendChild(flyingImg);

  // Kích hoạt hiệu ứng bay
  setTimeout(() => {
    flyingImg.style.top = `${cartRect.top + cartRect.height / 2 - 10}px`;
    flyingImg.style.left = `${cartRect.left + cartRect.width / 2 - 10}px`;
    flyingImg.style.width = "20px";
    flyingImg.style.height = "20px";
    flyingImg.style.opacity = "0.5";
  }, 10);

  // Thêm hiệu ứng nhún (bump) cho giỏ hàng khi ảnh bay tới
  setTimeout(() => {
    cartIcon.style.transform = "scale(1.2)";
    cartIcon.style.transition = "transform 0.2s ease-out";
    setTimeout(() => {
      cartIcon.style.transform = "scale(1)";
    }, 200);
  }, 700);

  // Xóa ảnh sau khi bay xong
  setTimeout(() => {
    document.body.removeChild(flyingImg);
  }, 800);
}
