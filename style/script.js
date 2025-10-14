// Multi-Step Form Controller
class MultiStepForm {
    constructor() {
        this.currentStep = 1;
        this.totalSteps = 5;
        this.formData = {};
        
        this.init();
    }

    init() {
        this.bindEvents();
        this.updateUI();
    }

    bindEvents() {
        // Navigation buttons
        const nextBtn = document.getElementById('nextBtn');
        const backBtn = document.getElementById('backBtn');
        const submitBtn = document.getElementById('submitBtn');

        nextBtn.addEventListener('click', () => this.nextStep());
        backBtn.addEventListener('click', () => this.prevStep());
        submitBtn.addEventListener('click', (e) => this.submitForm(e));

        // Priority selection (Step 1)
        this.bindPrioritySelection();
        
        // Qualification selection (Step 2)
        this.bindQualificationSelection();
        
        // Form inputs (Step 3)
        this.bindFormInputs();
        
        // Terms agreement (Step 4)
        this.bindTermsAgreement();
    }

    bindQualificationSelection() {
        const qualificationOptions = document.querySelectorAll('.qualification-option');
        
        qualificationOptions.forEach(option => {
            option.addEventListener('click', (e) => {
                e.preventDefault();
                
                const checkbox = option.querySelector('input[type="checkbox"]');
                const isSelected = option.classList.contains('selected');
                
                if (isSelected) {
                    option.classList.remove('selected');
                    checkbox.checked = false;
                } else {
                    option.classList.add('selected');
                    checkbox.checked = true;
                }
                
                this.updateFormData('qualifications', this.getSelectedQualifications());
            });
        });
    }

    bindPrioritySelection() {
        const priorityOptions = document.querySelectorAll('.priority-option');
        
        priorityOptions.forEach(option => {
            option.addEventListener('click', (e) => {
                e.preventDefault();
                
                // Remove selection from all options
                priorityOptions.forEach(opt => {
                    opt.classList.remove('selected');
                    opt.querySelector('input[type="radio"]').checked = false;
                });
                
                // Add selection to clicked option
                option.classList.add('selected');
                const radio = option.querySelector('input[type="radio"]');
                radio.checked = true;
                
                this.updateFormData('priority', radio.value);
            });
        });
    }

    bindFormInputs() {
        const inputs = document.querySelectorAll('.form-input, .form-select');
        
        inputs.forEach(input => {
            input.addEventListener('input', (e) => {
                this.updateFormData(e.target.name, e.target.value);
            });
        });
    }

    bindTermsAgreement() {
        const checkboxes = document.querySelectorAll('.checkbox-option input[type="checkbox"]');
        
        checkboxes.forEach(checkbox => {
            checkbox.addEventListener('change', (e) => {
                this.updateFormData(e.target.name, e.target.checked);
            });
        });
    }

    getSelectedQualifications() {
        const selected = [];
        const checkboxes = document.querySelectorAll('.qualification-option input[type="checkbox"]:checked');
        
        checkboxes.forEach(checkbox => {
            selected.push(checkbox.value);
        });
        
        return selected;
    }

    updateFormData(key, value) {
        this.formData[key] = value;
        console.log('Form Data Updated:', this.formData);
    }

    validateCurrentStep() {
        switch (this.currentStep) {
            case 1:
                return this.validatePriority();
            case 2:
                return this.validateQualifications();
            case 3:
                return this.validatePersonalInfo();
            case 4:
                return this.validateTerms();
            default:
                return true;
        }
    }

    validateQualifications() {
        const selected = this.getSelectedQualifications();
        if (selected.length === 0) {
            this.showError('資格を少なくとも1つ選択してください。');
            return false;
        }
        return true;
    }

    validatePriority() {
        const selected = document.querySelector('.priority-option input[type=\"radio\"]:checked');
        if (!selected) {
            this.showError('重視する項目を選択してください。');
            return false;
        }
        return true;
    }

    validatePersonalInfo() {
        const requiredFields = ['address', 'name', 'age', 'phone', 'email'];
        const missingFields = [];
        
        requiredFields.forEach(field => {
            const input = document.querySelector(`input[name=\"${field}\"]`);
            if (!input || !input.value.trim()) {
                missingFields.push(field);
            }
        });
        
        if (missingFields.length > 0) {
            this.showError('すべての必須項目を入力してください。');
            return false;
        }
        
        // Age validation
        const age = parseInt(document.querySelector('input[name=\"age\"]').value);
        if (age < 18 || age > 100) {
            this.showError('年齢は18歳以上100歳以下で入力してください。');
            return false;
        }
        
        // Email validation
        const email = document.querySelector('input[name=\"email\"]').value;
        if (!this.isValidEmail(email)) {
            this.showError('有効なメールアドレスを入力してください。');
            return false;
        }
        
        return true;
    }

    validateTerms() {
        const termsAgreement = document.querySelector('input[name=\"terms_agreement\"]');
        if (!termsAgreement || !termsAgreement.checked) {
            this.showError('利用規約に同意してください。');
            return false;
        }
        return true;
    }

    isValidEmail(email) {
        const emailRegex = /^[^\\s@]+@[^\\s@]+\\.[^\\s@]+$/;
        return emailRegex.test(email);
    }

    showError(message) {
        // Remove existing error message
        const existingError = document.querySelector('.error-message');
        if (existingError) {
            existingError.remove();
        }
        
        // Create and show new error message
        const errorDiv = document.createElement('div');
        errorDiv.className = 'error-message';
        errorDiv.style.cssText = `
            background: #e74c3c;
            color: white;
            padding: 10px 15px;
            border-radius: 8px;
            margin: 10px 0;
            font-size: 14px;
            text-align: center;
            animation: slideIn 0.3s ease;
        `;
        errorDiv.textContent = message;
        
        const navButtons = document.querySelector('.nav-buttons');
        navButtons.parentNode.insertBefore(errorDiv, navButtons);
        
        // Auto remove after 5 seconds
        setTimeout(() => {
            if (errorDiv.parentNode) {
                errorDiv.remove();
            }
        }, 5000);
    }

    nextStep() {
        if (!this.validateCurrentStep()) {
            return;
        }
        
        if (this.currentStep < this.totalSteps) {
            this.currentStep++;
            this.updateUI();
        }
    }

    prevStep() {
        if (this.currentStep > 1) {
            this.currentStep--;
            this.updateUI();
        }
    }

    updateUI() {
        this.updateSteps();
        this.updateProgressIndicator();
        this.updateButtons();
        
        // Smooth scroll to top
        window.scrollTo({ top: 0, behavior: 'smooth' });
    }

    updateSteps() {
        const steps = document.querySelectorAll('.form-step');
        
        steps.forEach((step, index) => {
            const stepNumber = index + 1;
            if (stepNumber === this.currentStep) {
                step.classList.add('active');
            } else {
                step.classList.remove('active');
            }
        });
    }

    updateProgressIndicator() {
        const progressSteps = document.querySelectorAll('.progress-indicator .step');
        
        progressSteps.forEach((step, index) => {
            const stepNumber = index + 1;
            
            if (stepNumber < this.currentStep) {
                step.classList.add('completed');
                step.classList.remove('active');
            } else if (stepNumber === this.currentStep) {
                step.classList.add('active');
                step.classList.remove('completed');
            } else {
                step.classList.remove('active', 'completed');
            }
        });
    }

    updateButtons() {
        const nextBtn = document.getElementById('nextBtn');
        const backBtn = document.getElementById('backBtn');
        const submitBtn = document.getElementById('submitBtn');
        
        // Back button
        if (this.currentStep === 1) {
            backBtn.style.display = 'none';
        } else {
            backBtn.style.display = 'block';
        }
        
        // Next/Submit buttons
        if (this.currentStep === this.totalSteps) {
            nextBtn.style.display = 'none';
            submitBtn.style.display = 'none'; // Hide submit on thank you page
        } else if (this.currentStep === this.totalSteps - 1) {
            nextBtn.style.display = 'none';
            submitBtn.style.display = 'block';
        } else {
            nextBtn.style.display = 'block';
            submitBtn.style.display = 'none';
        }
    }

    async submitForm(e) {
        e.preventDefault();
        
        if (!this.validateCurrentStep()) {
            return;
        }
        
        try {
            // Show loading state
            const submitBtn = document.getElementById('submitBtn');
            const originalText = submitBtn.textContent;
            submitBtn.textContent = '送信中...';
            submitBtn.disabled = true;
            
            // Simulate form submission
            await this.simulateFormSubmission();
            
            // Move to thank you page
            this.currentStep++;
            this.updateUI();
            
            // Reset button state
            submitBtn.textContent = originalText;
            submitBtn.disabled = false;
            
        } catch (error) {
            console.error('Form submission error:', error);
            this.showError('送信エラーが発生しました。もう一度お試しください。');
            
            // Reset button state
            const submitBtn = document.getElementById('submitBtn');
            submitBtn.textContent = '登録完了！';
            submitBtn.disabled = false;
        }
    }

    async simulateFormSubmission() {
        // Simulate API call delay
        return new Promise((resolve) => {
            setTimeout(() => {
                console.log('Form submitted successfully:', this.formData);
                resolve();
            }, 1500);
        });
    }
}

// Custom CSS for error messages
const errorStyles = document.createElement('style');
errorStyles.textContent = `
    @keyframes slideIn {
        from {
            opacity: 0;
            transform: translateY(-10px);
        }
        to {
            opacity: 1;
            transform: translateY(0);
        }
    }
    
    .error-message {
        animation: slideIn 0.3s ease;
    }
`;
document.head.appendChild(errorStyles);

// Initialize the form when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
    new MultiStepForm();
});

// Additional UI enhancements
document.addEventListener('DOMContentLoaded', () => {
    // Add smooth transitions to form elements
    const formElements = document.querySelectorAll('.form-input, .form-select, .qualification-option, .priority-option');
    
    formElements.forEach(element => {
        element.addEventListener('focusin', function() {
            this.style.transform = 'scale(1.02)';
        });
        
        element.addEventListener('focusout', function() {
            this.style.transform = 'scale(1)';
        });
    });
    
    // Add ripple effect to buttons
    const buttons = document.querySelectorAll('.btn-next, .btn-submit, .qualification-option, .priority-option');
    
    buttons.forEach(button => {
        button.addEventListener('click', function(e) {
            const ripple = document.createElement('span');
            const rect = this.getBoundingClientRect();
            const size = Math.max(rect.width, rect.height);
            const x = e.clientX - rect.left - size / 2;
            const y = e.clientY - rect.top - size / 2;
            
            ripple.style.cssText = `
                position: absolute;
                border-radius: 50%;
                background: rgba(255, 255, 255, 0.3);
                transform: scale(0);
                animation: ripple 0.6s linear;
                width: ${size}px;
                height: ${size}px;
                left: ${x}px;
                top: ${y}px;
                pointer-events: none;
            `;
            
            this.style.position = 'relative';
            this.style.overflow = 'hidden';
            this.appendChild(ripple);
            
            setTimeout(() => {
                ripple.remove();
            }, 600);
        });
    });
    
    // Add ripple animation
    const rippleAnimation = document.createElement('style');
    rippleAnimation.textContent = `
        @keyframes ripple {
            to {
                transform: scale(4);
                opacity: 0;
            }
        }
    `;
    document.head.appendChild(rippleAnimation);
});
