document.addEventListener('DOMContentLoaded', () => {
    
    // --- '자료실' 드래그 스크롤 기능 (기존 코드) ---
    const slider = document.querySelector('#datasheet .business-grid-wrapper');
    
    if (slider) {
        let isDown = false; 
        let startX; 
        let scrollLeft; 

        let velocity = 0; 
        let prevX = 0; 
        let animationFrameId = null; 
        
        const friction = 0.95; 
        const minVelocity = 0.5; 
        const dragSpeedMultiplier = 1.5; 

        slider.addEventListener('mousedown', (e) => {
            isDown = true;
            slider.classList.add('active'); 
            startX = e.pageX - slider.offsetLeft; 
            scrollLeft = slider.scrollLeft; 
            
            if (animationFrameId) cancelAnimationFrame(animationFrameId);
            prevX = e.pageX;
            velocity = 0;
        });

        slider.addEventListener('mousemove', (e) => {
            if (!isDown) return; 
            e.preventDefault(); 
            
            const x = e.pageX - slider.offsetLeft;
            const walk = (x - startX) * dragSpeedMultiplier;
            slider.scrollLeft = scrollLeft - walk; 
            
            velocity = e.pageX - prevX;
            prevX = e.pageX;
        });

        const momentumLoop = () => {
            slider.scrollLeft -= velocity;
            velocity *= friction;

            const maxScroll = slider.scrollWidth - slider.clientWidth;
            if (slider.scrollLeft <= 0 || slider.scrollLeft >= maxScroll) {
                velocity = 0; 
                if (slider.scrollLeft < 0) slider.scrollLeft = 0;
                if (slider.scrollLeft > maxScroll) slider.scrollLeft = maxScroll;
            }

            if (Math.abs(velocity) > minVelocity) {
                animationFrameId = requestAnimationFrame(momentumLoop);
            } else {
                cancelAnimationFrame(animationFrameId);
            }
        };

        const handleMouseUpOrLeave = () => {
            if (!isDown) return; 
            isDown = false;
            slider.classList.remove('active');
            
            if (animationFrameId) cancelAnimationFrame(animationFrameId);
            animationFrameId = requestAnimationFrame(momentumLoop);
        };

        slider.addEventListener('mouseup', handleMouseUpOrLeave);
        slider.addEventListener('mouseleave', handleMouseUpOrLeave);
    }
    
    
    // --- ▼▼▼ [신규] 3D 모델 뷰어 팝업 ▼▼▼ ---
    const modelButton = document.querySelector('#datasheet .business-card:first-child .btn-secondary');
        
    if (modelButton) {
        modelButton.addEventListener('click', (e) => {
            e.preventDefault(); // <a> 태그의 기본 이동(#) 방지
            
            const popupUrl = 'model_viewer.html'; // 3D 뷰어 HTML 파일
            const popupName = 'modelViewerPopup';
            const popupFeatures = 'width=800,height=600,scrollbars=no,resizable=yes';
            
            // 새 팝업창 열기
            window.open(popupUrl, popupName, popupFeatures);
        });
    }
    
});