window.HELP_IMPROVE_VIDEOJS = false;

var INTERP_BASE = "https://storage.googleapis.com/nerfies-public/interpolation/stacked";
var NUM_INTERP_FRAMES = 240;

var interp_images = [];
function preloadInterpolationImages() {
  for (var i = 0; i < NUM_INTERP_FRAMES; i++) {
    var path = INTERP_BASE + '/' + String(i).padStart(6, '0') + '.jpg';
    interp_images[i] = new Image();
    interp_images[i].src = path;
  }
}

function setInterpolationImage(i) {
  var image = interp_images[i];
  image.ondragstart = function() { return false; };
  image.oncontextmenu = function() { return false; };
  $('#interpolation-image-wrapper').empty().append(image);
}


$(document).ready(function() {
    // Check for click events on the navbar burger icon
    $(".navbar-burger").click(function() {
      // Toggle the "is-active" class on both the "navbar-burger" and the "navbar-menu"
      $(".navbar-burger").toggleClass("is-active");
      $(".navbar-menu").toggleClass("is-active");

    });

    var options = {
			slidesToScroll: 1,
			slidesToShow: 2,
			loop: true,
			infinite: true,
			autoplay: false,
			autoplaySpeed: 3000,
    }

		// Initialize all div with carousel class
    var carousels = bulmaCarousel.attach('.carousel', options);

    // Loop on each carousel initialized
    for(var i = 0; i < carousels.length; i++) {
    	// Add listener to  event
    	carousels[i].on('before:show', state => {
    		console.log(state);
    	});
    }

    // Access to bulmaCarousel instance of an element
    var element = document.querySelector('#my-element');
    if (element && element.bulmaCarousel) {
    	// bulmaCarousel instance is available as element.bulmaCarousel
    	element.bulmaCarousel.on('before-show', function(state) {
    		console.log(state);
    	});
    }

    /*var player = document.getElementById('interpolation-video');
    player.addEventListener('loadedmetadata', function() {
      $('#interpolation-slider').on('input', function(event) {
        console.log(this.value, player.duration);
        player.currentTime = player.duration / 100 * this.value;
      })
    }, false);*/
    preloadInterpolationImages();

    $('#interpolation-slider').on('input', function(event) {
      setInterpolationImage(this.value);
    });
    setInterpolationImage(0);
    $('#interpolation-slider').prop('max', NUM_INTERP_FRAMES - 1);

    bulmaSlider.attach();

    // Box Augmentation Demo functionality
    initializeBoxAugmentationDemo();

})

// Box Augmentation Demo Functions
function initializeBoxAugmentationDemo() {
    // Demo state
    let demoState = {
        currentPose: 'original',
        currentSize: 'original',
        isFullscreen: false,
        fullscreenType: null,
        fullscreenContainer: null
    };

    // Interactive demo configuration with correct file mappings
    const poseConfigs = {
        original: {
            html: 'sub3_largebox_003_original.html',
            title: 'Original Object Pose',
            description: 'Interactive 3D visualization with original object placement'
        },
        rot45cw: {
            html: 'sub3_largebox_003_rot_0.html',
            title: 'Rotated 45° Clockwise',
            description: 'Interactive 3D visualization with object rotated 45 degrees clockwise'
        },
        rot45ccw: {
            html: 'sub3_largebox_003_rot_1.html',
            title: 'Rotated 45° Counter-Clockwise',
            description: 'Interactive 3D visualization with object rotated 45 degrees counter-clockwise'
        },
        translate_front: {
            html: 'sub3_largebox_003_trans_0.html',
            title: 'Translated Forward',
            description: 'Interactive 3D visualization with object moved forward'
        },
        translate_left: {
            html: 'sub3_largebox_003_trans_1.html',
            title: 'Translated Left',
            description: 'Interactive 3D visualization with object moved to the left'
        },
        translate_right: {
            html: 'sub3_largebox_003_trans_2.html',
            title: 'Translated Right',
            description: 'Interactive 3D visualization with object moved to the right'
        }
    };

    const sizeConfigs = {
        original: {
            html: 'sub3_largebox_003_original.html',
            title: 'Original Object Size',
            description: 'Interactive 3D visualization with original object size'
        },
        small: {
            html: 'sub3_largebox_003_small.html',
            title: 'Small Object Size',
            description: 'Interactive 3D visualization with smaller object'
        },
        large: {
            html: 'sub3_largebox_003_large.html',
            title: 'Large Object Size',
            description: 'Interactive 3D visualization with larger object'
        }
    };

    // File path configurations
    const filePaths = {
        pose: './static/interactive_demo/box_pose/',
        size: './static/interactive_demo/box_size/'
    };

    // Get DOM elements
    const poseIframe = document.getElementById('pose-demo-iframe');
    const sizeIframe = document.getElementById('size-demo-iframe');
    const poseDescription = document.getElementById('pose-description');
    const sizeDescription = document.getElementById('size-description');
    const fullscreenBtn = document.getElementById('fullscreen-btn');
    const fullscreenPoseBtn = document.getElementById('fullscreen-pose-btn');
    const fullscreenSizeBtn = document.getElementById('fullscreen-size-btn');
    const sizeSelect = document.getElementById('size-select');
    const loadPoseDemoBtn = document.getElementById('load-pose-demo-btn');
    const loadSizeDemoBtn = document.getElementById('load-size-demo-btn');
    const poseOptions = document.querySelectorAll('.pose-option');
    const sizeOptions = document.querySelectorAll('.size-option');

    // Check if required elements exist
    if (!poseIframe) {
        console.error('poseIframe not found!');
        return;
    }
    if (poseOptions.length === 0) {
        console.error('No pose options found!');
        return;
    }
    if (sizeOptions.length === 0) {
        console.error('No size options found!');
        return;
    }

    // Event listeners
    loadPoseDemoBtn.addEventListener('click', loadPoseDemo);
    loadSizeDemoBtn.addEventListener('click', loadSizeDemo);
    if (fullscreenBtn) {
        fullscreenBtn.addEventListener('click', toggleFullscreen);
    }
    if (fullscreenPoseBtn) {
        fullscreenPoseBtn.addEventListener('click', () => toggleFullscreen('pose'));
    }
    if (fullscreenSizeBtn) {
        fullscreenSizeBtn.addEventListener('click', () => toggleFullscreen('size'));
    }

    // Add click listeners to pose options
    poseOptions.forEach((option, index) => {
        // Primary click handler
        option.addEventListener('click', (e) => {
            e.preventDefault();
            e.stopPropagation();
            selectPoseOption(option);
        });
        
        // Touch support for mobile devices
        option.addEventListener('touchend', (e) => {
            e.preventDefault();
            e.stopPropagation();
            selectPoseOption(option);
        });
    });

    // Add click listeners to size options
    sizeOptions.forEach((option, index) => {
        // Primary click handler
        option.addEventListener('click', (e) => {
            e.preventDefault();
            e.stopPropagation();
            selectSizeOption(option);
        });
        
        // Touch support for mobile devices
        option.addEventListener('touchend', (e) => {
            e.preventDefault();
            e.stopPropagation();
            selectSizeOption(option);
        });
    });

    // Initialize
    selectPoseOption(poseOptions[0]); // Select first option by default
    selectSizeOption(sizeOptions[0]); // Select first option by default

    function selectPoseOption(selectedOption) {
        // Remove active class from all options
        poseOptions.forEach(option => {
            option.classList.remove('active');
        });
        
        // Add active class to selected option
        selectedOption.classList.add('active');
        
        // Store current pose
        demoState.currentPose = selectedOption.dataset.pose;
        
        // Update description
        const config = poseConfigs[selectedOption.dataset.pose];
        if (config) {
            poseDescription.textContent = config.description;
        }
        
        // Add click effect
        addClickEffect(selectedOption);
        
        // Automatically load the demo when a pose option is selected
        loadPoseDemo();
    }

    function selectSizeOption(selectedOption) {
        // Remove active class from all options
        sizeOptions.forEach(option => {
            option.classList.remove('active');
        });
        
        // Add active class to selected option
        selectedOption.classList.add('active');
        
        // Store current size
        demoState.currentSize = selectedOption.dataset.size;
        
        // Update description
        const config = sizeConfigs[selectedOption.dataset.size];
        if (config) {
            sizeDescription.textContent = config.description;
        }
        
        // Add click effect
        addClickEffect(selectedOption);
        
        // Automatically load the demo when a size option is selected
        loadSizeDemo();
    }

    function updateSizeDescription() {
        const selectedSize = demoState.currentSize;
        const config = sizeConfigs[selectedSize];
        if (config) {
            sizeDescription.textContent = config.description;
        }
    }

    function loadPoseDemo() {
        const selectedPose = demoState.currentPose;
        const config = poseConfigs[selectedPose];
        
        if (config && config.html) {
            const htmlPath = `${filePaths.pose}${config.html}`;
            
            // Add loading indicator
            showLoadingIndicator('pose');
            
            // Force iframe reload by clearing src first
            poseIframe.src = '';
            
            // Small delay to ensure iframe is cleared
            setTimeout(() => {
                poseIframe.src = htmlPath;
            }, 100);

            // Update description
            poseDescription.textContent = config.description;

            // Hide loading indicator after iframe loads
            poseIframe.onload = () => {
                hideLoadingIndicator('pose');
            };

            // Handle loading errors
            poseIframe.onerror = () => {
                hideLoadingIndicator('pose');
                console.error('Failed to load pose demo:', htmlPath);
                poseDescription.textContent = 'Error loading demo. Please try again.';
            };

            // Add loading effect to button
            addLoadingEffect(loadPoseDemoBtn);
        } else {
            console.error('No config found for pose:', selectedPose);
        }
    }

    function loadSizeDemo() {
        const selectedSize = demoState.currentSize;
        const config = sizeConfigs[selectedSize];
        
        if (config && config.html) {
            const htmlPath = `${filePaths.size}${config.html}`;
            
            // Add loading indicator
            showLoadingIndicator('size');
            
            // Force iframe reload by clearing src first
            sizeIframe.src = '';
            
            // Small delay to ensure iframe is cleared
            setTimeout(() => {
                sizeIframe.src = htmlPath;
            }, 100);

            // Update description
            sizeDescription.textContent = config.description;

            // Store current size
            demoState.currentSize = selectedSize;

            // Hide loading indicator after iframe loads
            sizeIframe.onload = () => {
                hideLoadingIndicator('size');
            };

            // Handle loading errors
            sizeIframe.onerror = () => {
                hideLoadingIndicator('size');
                console.error('Failed to load size demo:', htmlPath);
                sizeDescription.textContent = 'Error loading demo. Please try again.';
            };

            // Add loading effect to button
            addLoadingEffect(loadSizeDemoBtn);
        } else {
            console.error('No config found for size:', selectedSize);
        }
    }

    function addClickEffect(element) {
        element.style.transform = 'scale(0.95)';
        setTimeout(() => {
            element.style.transform = 'scale(1)';
        }, 150);
    }

    function toggleFullscreen(demoType = 'both') {
        const targetIframe = demoType === 'pose' ? poseIframe : 
                           demoType === 'size' ? sizeIframe : null;
        
        if (!demoState.isFullscreen) {
            // Enter fullscreen - target only the iframe
            if (targetIframe) {
                // Create a fullscreen container for the iframe
                const fullscreenContainer = document.createElement('div');
                fullscreenContainer.id = 'fullscreen-iframe-container';
                fullscreenContainer.style.cssText = `
                    position: fixed;
                    top: 0;
                    left: 0;
                    width: 100vw;
                    height: 100vh;
                    background: #000;
                    z-index: 9999;
                    display: flex;
                    align-items: center;
                    justify-content: center;
                `;
                
                // Clone the iframe for fullscreen
                const fullscreenIframe = targetIframe.cloneNode(true);
                fullscreenIframe.style.cssText = `
                    width: 100vw;
                    height: 100vh;
                    border: none;
                    border-radius: 0;
                `;
                
                // Add close button
                const closeButton = document.createElement('button');
                closeButton.innerHTML = '✕';
                closeButton.style.cssText = `
                    position: absolute;
                    top: 20px;
                    right: 20px;
                    background: rgba(0,0,0,0.7);
                    color: white;
                    border: none;
                    border-radius: 50%;
                    width: 40px;
                    height: 40px;
                    font-size: 20px;
                    cursor: pointer;
                    z-index: 10000;
                `;
                
                closeButton.addEventListener('click', () => {
                    exitFullscreen();
                });
                
                // Add keyboard support for escape key
                const handleKeyPress = (e) => {
                    if (e.key === 'Escape') {
                        exitFullscreen();
                        document.removeEventListener('keydown', handleKeyPress);
                    }
                };
                document.addEventListener('keydown', handleKeyPress);
                
                fullscreenContainer.appendChild(fullscreenIframe);
                fullscreenContainer.appendChild(closeButton);
                document.body.appendChild(fullscreenContainer);
                
                // Request fullscreen
                if (fullscreenContainer.requestFullscreen) {
                    fullscreenContainer.requestFullscreen();
                } else if (fullscreenContainer.webkitRequestFullscreen) {
                    fullscreenContainer.webkitRequestFullscreen();
                } else if (fullscreenContainer.msRequestFullscreen) {
                    fullscreenContainer.msRequestFullscreen();
                }
                
                demoState.isFullscreen = true;
                demoState.fullscreenType = demoType;
                demoState.fullscreenContainer = fullscreenContainer;
                
                // Update button states
                updateFullscreenButtons(true, demoType);
            }
        } else {
            exitFullscreen();
        }
    }

    function exitFullscreen() {
        // Exit fullscreen
        if (document.exitFullscreen) {
            document.exitFullscreen();
        } else if (document.webkitExitFullscreen) {
            document.webkitExitFullscreen();
        } else if (document.msExitFullscreen) {
            document.msExitFullscreen();
        }
        
        // Remove fullscreen container
        if (demoState.fullscreenContainer) {
            document.body.removeChild(demoState.fullscreenContainer);
            demoState.fullscreenContainer = null;
        }
        
        demoState.isFullscreen = false;
        demoState.fullscreenType = null;
        
        // Update button states
        updateFullscreenButtons(false, 'both');
    }

    function updateFullscreenButtons(isFullscreen, demoType) {
        const expandIcon = 'fas fa-expand';
        const compressIcon = 'fas fa-compress';
        
        if (isFullscreen) {
            if (demoType === 'pose' || demoType === 'both') {
                if (fullscreenPoseBtn) {
                    fullscreenPoseBtn.querySelector('i').className = compressIcon;
                    fullscreenPoseBtn.querySelector('span:last-child').textContent = 'Exit';
                }
            }
            if (demoType === 'size' || demoType === 'both') {
                if (fullscreenSizeBtn) {
                    fullscreenSizeBtn.querySelector('i').className = compressIcon;
                    fullscreenSizeBtn.querySelector('span:last-child').textContent = 'Exit';
                }
            }
            if (fullscreenBtn) {
                fullscreenBtn.querySelector('i').className = compressIcon;
                fullscreenBtn.querySelector('span:last-child').textContent = 'Exit Fullscreen';
            }
        } else {
            if (fullscreenPoseBtn) {
                fullscreenPoseBtn.querySelector('i').className = expandIcon;
                fullscreenPoseBtn.querySelector('span:last-child').textContent = 'Fullscreen';
            }
            if (fullscreenSizeBtn) {
                fullscreenSizeBtn.querySelector('i').className = expandIcon;
                fullscreenSizeBtn.querySelector('span:last-child').textContent = 'Fullscreen';
            }
            if (fullscreenBtn) {
                fullscreenBtn.querySelector('i').className = expandIcon;
                fullscreenBtn.querySelector('span:last-child').textContent = 'Fullscreen View';
            }
        }
    }

    function showLoadingIndicator(type) {
        const loadingDiv = document.createElement('div');
        loadingDiv.id = `demo-loading-${type}`;
        loadingDiv.innerHTML = `
            <div style="position: absolute; top: 50%; left: 50%; transform: translate(-50%, -50%); 
                        background: rgba(255,255,255,0.9); padding: 1.5rem; border-radius: 10px; 
                        text-align: center; z-index: 1000;">
                <i class="fas fa-spinner fa-spin" style="font-size: 1.5rem; color: #3498db; margin-bottom: 0.5rem;"></i>
                <p style="color: #333; font-weight: bold; font-size: 0.9rem;">Loading ${type} demo...</p>
            </div>
        `;
        loadingDiv.style.position = 'relative';
        
        const targetWrapper = type === 'pose' ? 
            poseIframe.parentElement : 
            sizeIframe.parentElement;
        targetWrapper.appendChild(loadingDiv);
    }

    function hideLoadingIndicator(type) {
        const loadingDiv = document.getElementById(`demo-loading-${type}`);
        if (loadingDiv) {
            loadingDiv.remove();
        }
    }

    function addLoadingEffect(element) {
        element.style.opacity = '0.7';
        element.style.transform = 'scale(0.95)';
        setTimeout(() => {
            element.style.opacity = '1';
            element.style.transform = 'scale(1)';
        }, 300);
    }

    // Add interactive effects
    function addInteractiveEffects() {
        // Add hover effects to size dropdown
        sizeSelect.addEventListener('focus', function() {
            this.parentElement.style.transform = 'scale(1.02)';
            this.parentElement.style.transition = 'transform 0.3s ease';
        });
        
        sizeSelect.addEventListener('blur', function() {
            this.parentElement.style.transform = 'scale(1)';
        });

        // Add iframe hover effects
        [poseIframe, sizeIframe].forEach(iframe => {
            iframe.addEventListener('mouseenter', function() {
                this.style.transform = 'scale(1.01)';
                this.style.transition = 'transform 0.3s ease';
            });

            iframe.addEventListener('mouseleave', function() {
                this.style.transform = 'scale(1)';
            });
        });

        // Handle fullscreen change events
        document.addEventListener('fullscreenchange', handleFullscreenChange);
        document.addEventListener('webkitfullscreenchange', handleFullscreenChange);
        document.addEventListener('msfullscreenchange', handleFullscreenChange);
    }

    function handleFullscreenChange() {
        if (!document.fullscreenElement && !document.webkitFullscreenElement && !document.msFullscreenElement) {
            // Exited fullscreen
            exitFullscreen();
        }
    }

    // Initialize interactive effects
    addInteractiveEffects();
}
