document.addEventListener('DOMContentLoaded', function() {
    // Get form elements
    const form = document.getElementById('moveOrderForm');
    const generateButton = document.getElementById('generateButton');
    const resultContainer = document.getElementById('resultContainer');
    const templateOutput = document.getElementById('templateOutput');
    const copyButton = document.getElementById('copyButton');
    
    // Show/hide conditional fields based on checkbox selections
    setupConditionalFields();
    
    // Generate template when button is clicked
    generateButton.addEventListener('click', function() {
        generateMoveOrderTemplate();
    });
    
    // Copy template to clipboard
    copyButton.addEventListener('click', function() {
        copyTemplateToClipboard();
    });
    
    function setupConditionalFields() {
        // Contract cancellation conditional fields
        document.getElementById('cancelContract').addEventListener('change', function() {
            document.getElementById('cancelContractDoneGroup').style.display = this.checked ? 'block' : 'none';
        });
        
        // Cancel date "is it done" field - always show when a date is selected
        document.getElementById('cancelDate').addEventListener('change', function() {
            document.getElementById('cancelDateDoneGroup').style.display = this.value ? 'block' : 'none';
        });
        
        // Router and tech swap conditional fields
        document.getElementById('newRouter').addEventListener('change', function() {
            document.getElementById('techSwapGroup').style.display = this.checked ? 'block' : 'none';
            document.getElementById('newRouterDoneGroup').style.display = this.checked ? 'block' : 'none';
            if (!this.checked) {
                document.getElementById('techSwapDoneGroup').style.display = 'none';
            }
        });
        
        document.getElementById('techSwap').addEventListener('change', function() {
            document.getElementById('techSwapDoneGroup').style.display = this.checked ? 'block' : 'none';
        });
        
        // Digital voice conditional fields
        document.getElementById('digitalVoice').addEventListener('change', function() {
            document.getElementById('premiseMoveGroup').style.display = this.checked ? 'block' : 'none';
        });
        
        document.getElementById('premiseMove').addEventListener('change', function() {
            document.getElementById('premiseMoveDoneGroup').style.display = this.checked ? 'block' : 'none';
        });
        
        // ETC waiver conditional fields
        document.getElementById('etcWaiver').addEventListener('change', function() {
            document.getElementById('etcWaiverDoneGroup').style.display = this.checked ? 'block' : 'none';
        });
    }
    
    function generateMoveOrderTemplate() {
        // Get all form values
        const oldSOID = document.getElementById('oldSOID').value;
        const newSOID = document.getElementById('newSOID').value;
        const casesLinkedText = document.getElementById('casesLinkedText').value;
        const internalMove = document.getElementById('internalMove').checked;
        
        // Contract
        const cancelContract = document.getElementById('cancelContract').checked;
        const cancelContractDone = document.getElementById('cancelContractDone').checked;
        
        // Dates
        const cancelDate = document.getElementById('cancelDate').value;
        const cancelDateDone = document.getElementById('cancelDateDone').checked;
        const newServiceDate = document.getElementById('newServiceDate').value;
        
        // Router
        const newRouter = document.getElementById('newRouter').checked;
        const newRouterDone = document.getElementById('newRouterDone').checked;
        const techSwap = document.getElementById('techSwap').checked;
        const techSwapDone = document.getElementById('techSwapDone').checked;
        
        // Digital Voice
        const digitalVoice = document.getElementById('digitalVoice').checked;
        const premiseMove = document.getElementById('premiseMove').checked;
        const premiseMoveDone = document.getElementById('premiseMoveDone').checked;
        
        // Email and ETCs
        const zenEmail = document.getElementById('zenEmail').checked;
        const etcWaiver = document.getElementById('etcWaiver').checked;
        const etcWaiverDone = document.getElementById('etcWaiverDone').checked;
        
        // Format the dates
        const formattedCancelDate = formatDate(cancelDate);
        const formattedNewServiceDate = formatDate(newServiceDate);
        
        // Generate template
        let template = `*****MOVE ORDER*****
Has contract been removed: ${cancelContract ? 'YES' : 'N/A'} - ${cancelContract ? (cancelContractDone ? 'DONE' : 'NOT DONE') : 'N/A'}
Date to cancel old Services: ${formattedCancelDate} - ${cancelDateDone ? 'DONE' : 'NOT DONE'}
Transfer of tech: ${techSwap ? 'YES' : 'NO'} ${techSwap ? (techSwapDone ? 'DONE' : 'NOT DONE') : ''}
Does the user have a Zen email: ${zenEmail ? 'YES' : 'NO'}
Update billing address: ${internalMove ? 'INTERNAL MOVE' : 'YES'}
New service is live on: ${formattedNewServiceDate}
Copper Renumber order: N/A
Copper Renumber to be placed on: N/A
Copper Renumber to complete on: N/A
DV Address Amend required: ${digitalVoice ? 'YES' : 'N/A'}
DV Port Order Required: ${digitalVoice ? 'YES' : 'N/A'}
DV IPEX MOVING PREMISES REQUIRED: ${digitalVoice && premiseMove ? 'YES' : 'N/A'} ${digitalVoice && premiseMove ? (premiseMoveDone ? '- DONE' : '- NOT DONE') : ''}
ETCs: ${etcWaiver ? 'YES = ZERO COSTED' : 'N/A'} ${etcWaiver ? (etcWaiverDone ? '- DONE' : '- NOT DONE') : ''}
New Order SOID: ${newSOID}
Old Order SOID: ${oldSOID}`;
        
        // Display the template
        templateOutput.textContent = template;
        resultContainer.classList.remove('hidden');
        
        // Scroll to results
        resultContainer.scrollIntoView({ behavior: 'smooth' });
    }
    
    function formatDate(dateString) {
        if (!dateString) return '';
        
        const date = new Date(dateString);
        return date.toLocaleDateString('en-GB', {
            day: '2-digit',
            month: '2-digit',
            year: 'numeric'
        });
    }
    
    function copyTemplateToClipboard() {
        const textToCopy = templateOutput.textContent;
        
        navigator.clipboard.writeText(textToCopy).then(
            function() {
                // Temporarily change button text to indicate success
                const originalText = copyButton.textContent;
                copyButton.textContent = 'Copied!';
                copyButton.style.backgroundColor = '#27ae60';
                
                // Revert button text after a short delay
                setTimeout(function() {
                    copyButton.textContent = originalText;
                    copyButton.style.backgroundColor = '#2ecc71';
                }, 2000);
            },
            function() {
                // Handle errors
                copyButton.textContent = 'Failed to copy';
                copyButton.style.backgroundColor = '#e74c3c';
                
                setTimeout(function() {
                    copyButton.textContent = 'Copy to Clipboard';
                    copyButton.style.backgroundColor = '#2ecc71';
                }, 2000);
            }
        );
    }
});