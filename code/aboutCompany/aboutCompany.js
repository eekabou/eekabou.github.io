document.addEventListener('DOMContentLoaded', function() {
    
    // --- [삭제됨] 연혁 섹션 스크롤 로직 ---
    // (performance-grid, scroll-left, scroll-right 요소가 
    // 새로운 디자인에서 제거되었으므로 관련 스크립트 모두 삭제)


    // --- 2. 인증서 모달 로직 ---
    const modal = document.getElementById('image-modal');
    const modalImg = document.getElementById('modal-image');
    const closeModal = document.querySelector('.modal-close'); 
    const certItems = document.querySelectorAll('.cert-item');

    if (modal && modalImg && closeModal && certItems.length > 0) {
        
        certItems.forEach(item => {
            item.addEventListener('click', function() {
                const imgSrc = this.dataset.src;
                if (imgSrc) {
                    modalImg.src = imgSrc;
                    modal.classList.add('show');
                }
            });
        });

        closeModal.addEventListener('click', function() {
            modal.classList.remove('show');
        });

        modal.addEventListener('click', function(e) {
            if (e.target === modal) {
                modal.classList.remove('show');
            }
        });

        document.addEventListener('keydown', function(e) {
            if (e.key === 'Escape' && modal.classList.contains('show')) {
                modal.classList.remove('show');
            }
        });

    } else {
        console.warn('Modal elements (image-modal) not found.');
    }

});