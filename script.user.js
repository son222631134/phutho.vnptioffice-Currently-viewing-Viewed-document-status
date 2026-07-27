// ==UserScript==
// @name         Hiện trạng thái Đang xem/Đã xem trên icon iOffice
// @namespace    http://tampermonkey.net/
// @version      3.0
// @description  Giữ nguyên thẻ <i>, thay đổi chữ thành Đang xem/Đã xem
// @author       Bạn
// @match        *://phutho.vnptioffice.vn/*
// @grant        none
// ==/UserScript==

(function() {
    'use strict';

    // ==========================================
    // BƯỚC 1: NHÚNG MÃ CSS ẢO VÀO TRANG WEB
    // ==========================================
    const style = document.createElement('style');
    style.innerHTML = `
        /* 1. Ẩn chữ gốc của web (Ép size = 0) */
        .tm-btn-dang-xem, .tm-btn-da-xem {
            font-size: 0px !important;
        }

        /* 2. Ép thẻ icon <i> hiển thị lại bình thường */
        .tm-btn-dang-xem i, .tm-btn-da-xem i {
            font-size: 13px !important; /* Size chuẩn của icon */
            display: inline-block;
        }

        /* 3. Nút ĐANG XEM (Nút vừa bấm) */
        .tm-btn-dang-xem::after {
            content: " Đang xem"; /* Có dấu cách ở đầu để hở ra so với icon */
            font-size: 12px !important;
            font-family: inherit;
            /*color: black !important;*/
            /*font-weight: bold;*/
        }

        /* 4. Nút ĐÃ XEM (Nút bấm trước đó) */
        .tm-btn-da-xem::after {
            content: " Đã xem";
            font-size: 12px !important;
            font-family: inherit;
            color: #fff !important; /* Trả lại màu chữ trắng mặc định của btn */
        }
    `;
    document.head.appendChild(style);

    // ==========================================
    // BƯỚC 2: QUÉT VÀ DỌN DẸP STYLE RÁC LÚC LOAD TRANG
    // ==========================================
    setInterval(() => {
        const buttons = document.querySelectorAll('.btn-primary, .btn-success');

        buttons.forEach(btn => {
            // Nếu nút đang có trạng thái Đang xem / Đã xem -> Không dọn style nữa
            if (btn.classList.contains('tm-btn-dang-xem') || btn.classList.contains('tm-btn-da-xem')) return;

            // Xóa màu rác mặc định của web (ví dụ cái darkred)
            if (btn.style.backgroundColor) btn.style.removeProperty('background-color');
            if (btn.style.color) btn.style.removeProperty('color');
        });
    }, 1000);

    // ==========================================
    // BƯỚC 3: BẮT SỰ KIỆN CLICK (MOUSEDOWN)
    // ==========================================
    document.addEventListener('mousedown', function(event) {

        // CHẶN CHUỘT PHẢI: Chỉ cho phép click chuột trái (event.button === 0) mới được chạy code
        if (event.button !== 0) return;

        const clickedBtn = event.target.closest('.btn-primary, .btn-success');

        if (clickedBtn) {

            // ----------------------------------------------------
            // A. CHUYỂN NÚT "ĐANG XEM" CŨ THÀNH NÚT "ĐÃ XEM"
            // ----------------------------------------------------
            const oldButtons = document.querySelectorAll('.tm-btn-dang-xem');
            oldButtons.forEach(oldBtn => {
                if (oldBtn === clickedBtn) return; // Nếu vô tình bấm lại nút đang xem thì bỏ qua

                // Xóa trạng thái Đang xem, chuyển sang Đã xem
                oldBtn.classList.remove('tm-btn-dang-xem');
                oldBtn.classList.add('tm-btn-da-xem');

                // Xóa màu vàng !important đi để nó trở về màu mặc định (xanh dương/xanh lá)
                // oldBtn.style.removeProperty('background-color');
                // oldBtn.style.removeProperty('border-color');
                oldBtn.style.setProperty('background-color', 'darkred', 'important');

            });

            // ----------------------------------------------------
            // B. XỬ LÝ NÚT MỚI VỪA BẤM (CHUYỂN THÀNH "ĐANG XEM")
            // ----------------------------------------------------

            // Nếu nút này trước đó là "Đã xem", ta xóa class đó đi
            clickedBtn.classList.remove('tm-btn-da-xem');

            // Gắn class "Đang xem" vào
            clickedBtn.classList.add('tm-btn-dang-xem');

            // Ép màu nền vàng nổi bật cho nút đang xem
            clickedBtn.style.setProperty('background-color', 'darkgreen', 'important');
            // clickedBtn.style.setProperty('border-color', 'yellow', 'important');

        }
    }, true);

})();
