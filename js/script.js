document.addEventListener('DOMContentLoaded', function() {
    // Set current year in footer
    document.getElementById('currentYear').textContent = new Date().getFullYear();
    
    const qrForm = document.getElementById('qrForm');
    const qrCodeContainer = document.getElementById('qrCodeContainer');
    const qrCodeDiv = document.getElementById('qrCode');
    const downloadBtn = document.getElementById('downloadBtn');
    
    qrForm.addEventListener('submit', function(e) {
        e.preventDefault();
        
        // Get form values
        const text = document.getElementById('qrText').value.trim();
        const size = parseInt(document.getElementById('qrSize').value);
        const color = document.getElementById('qrColor').value;
        const bgColor = document.getElementById('qrBgColor').value;
        const errorLevel = document.getElementById('qrErrorLevel').value;
        
        if (!text) {
            showAlert('Please enter some text or URL to generate QR code', 'warning');
            return;
        }
        
        // Clear previous QR code
        qrCodeDiv.innerHTML = '';
        
        // Create a canvas element explicitly
        const canvas = document.createElement('canvas');
        qrCodeDiv.appendChild(canvas);
        
        // Show loading state
        qrCodeContainer.style.display = 'block';
        downloadBtn.disabled = true;
        
        // Generate new QR code with error handling
        try {
            QRCode.toCanvas(canvas, text, {
                width: size,
                color: {
                    dark: color,
                    light: bgColor
                },
                errorCorrectionLevel: errorLevel,
                margin: 1
            }, function(error) {
                if (error) {
                    console.error('QR Generation Error:', error);
                    showAlert(`Failed to generate QR code: ${error.message}`, 'danger');
                    qrCodeContainer.style.display = 'none';
                    return;
                }
                
                // Show the QR code container
                qrCodeContainer.style.display = 'block';
                
                // Enable download button
                downloadBtn.disabled = false;
                
                // Set up download functionality
                setupDownload(canvas);
            });
        } catch (error) {
            console.error('QR Generation Exception:', error);
            showAlert(`An unexpected error occurred: ${error.message}`, 'danger');
            qrCodeContainer.style.display = 'none';
        }
    });
    
    function setupDownload(canvas) {
        downloadBtn.onclick = function() {
            try {
                // Create a temporary link to download the canvas as PNG
                const link = document.createElement('a');
                link.download = `QRCode-${new Date().getTime()}.png`;
                link.href = canvas.toDataURL('image/png');
                document.body.appendChild(link);
                link.click();
                document.body.removeChild(link);
            } catch (error) {
                console.error('Download Error:', error);
                showAlert(`Failed to download QR code: ${error.message}`, 'danger');
            }
        };
    }
    
    // Helper function to show Bootstrap alerts
    function showAlert(message, type) {
        // Remove any existing alerts
        const existingAlert = document.querySelector('.alert');
        if (existingAlert) {
            existingAlert.remove();
        }
        
        // Create alert element
        const alertDiv = document.createElement('div');
        alertDiv.className = `alert alert-${type} alert-dismissible fade show mt-3`;
        alertDiv.setAttribute('role', 'alert');
        alertDiv.innerHTML = `
            ${message}
            <button type="button" class="btn-close" data-bs-dismiss="alert" aria-label="Close"></button>
        `;
        
        // Insert after the form
        qrForm.parentNode.insertBefore(alertDiv, qrForm.nextSibling);
        
        // Auto-dismiss after 5 seconds
        setTimeout(() => {
            const bsAlert = new bootstrap.Alert(alertDiv);
            bsAlert.close();
        }, 5000);
    }
    
    // Helper function to check if string is a URL
    function isValidUrl(string) {
        try {
            new URL(string);
            return true;
        } catch (_) {
            // If it's not a valid URL, check if it looks like a domain name
            return string.includes('.') && !string.includes(' ');
        }
    }
});