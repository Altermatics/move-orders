document.addEventListener('DOMContentLoaded', function() {
    // Get form elements
    const form = document.getElementById('moveOrderForm');
    const generateButton = document.getElementById('generateButton');
    const generateEmailButton = document.getElementById('generateEmailButton');
    const resultContainer = document.getElementById('resultContainer');
    const emailContainer = document.getElementById('emailContainer');
    const templateOutput = document.getElementById('templateOutput');
    const emailOutput = document.getElementById('emailOutput');
    const copyButton = document.getElementById('copyButton');
    const copyEmailButton = document.getElementById('copyEmailButton');
    
    // Show/hide conditional fields based on checkbox selections
    setupConditionalFields();
    
    // Generate template when button is clicked
    generateButton.addEventListener('click', function() {
        generateMoveOrderTemplate();
    });
    
    // Generate email when button is clicked
    generateEmailButton.addEventListener('click', function() {
        generateCustomerEmail();
    });
    
    // Copy template to clipboard
    copyButton.addEventListener('click', function() {
        copyToClipboard(templateOutput.textContent, copyButton);
    });
    
    // Copy email to clipboard
    copyEmailButton.addEventListener('click', function() {
        copyToClipboard(emailOutput.textContent, copyEmailButton);
    });
    
    function setupConditionalFields() {
        // Engineer attendance conditional fields
        document.getElementById('engineerAttending').addEventListener('change', function() {
            document.getElementById('engineerTimeSlotGroup').style.display = this.checked ? 'block' : 'none';
        });
        
        // Contract cancellation conditional fields
        document.getElementById('cancelContract').addEventListener('change', function() {
            document.getElementById('cancelContractDoneGroup').style.display = this.checked ? 'block' : 'none';
        });
        
        // Cancel date "is it done" field - show when a date is selected or TBC/when service live is checked
        document.getElementById('cancelDate').addEventListener('change', function() {
            updateCancelDateDoneGroup();
        });
        
        // TBC checkbox handling
        document.getElementById('cancelDateTBC').addEventListener('change', function() {
            if (this.checked) {
                document.getElementById('cancelDate').value = '';
                document.getElementById('cancelDate').disabled = true;
                document.getElementById('cancelWhenServiceLive').checked = false;
            } else {
                document.getElementById('cancelDate').disabled = false;
            }
            updateCancelDateDoneGroup();
        });
        
        // When service live checkbox handling
        document.getElementById('cancelWhenServiceLive').addEventListener('change', function() {
            if (this.checked) {
                document.getElementById('cancelDate').value = '';
                document.getElementById('cancelDate').disabled = true;
                document.getElementById('cancelDateTBC').checked = false;
            } else {
                document.getElementById('cancelDate').disabled = false;
            }
            updateCancelDateDoneGroup();
        });
        
        // Tech swap conditional field
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
        
        // Zen email conditional fields
        document.getElementById('zenEmail').addEventListener('change', function() {
            document.getElementById('keepEmailGroup').style.display = this.checked ? 'block' : 'none';
        });
        
        // ETC waiver conditional fields
        document.getElementById('etcWaiver').addEventListener('change', function() {
            document.getElementById('etcWaiverDoneGroup').style.display = this.checked ? 'block' : 'none';
        });
    }
    
    function updateCancelDateDoneGroup() {
        const hasDate = document.getElementById('cancelDate').value;
        const isTBC = document.getElementById('cancelDateTBC').checked;
        const isWhenServiceLive = document.getElementById('cancelWhenServiceLive').checked;
        
        document.getElementById('cancelDateDoneGroup').style.display = 
            (hasDate || isTBC || isWhenServiceLive) ? 'block' : 'none';
    }
    
    function generateMoveOrderTemplate() {
        // Get all form values
        const oldSOID = document.getElementById('oldSOID').value;
        const newSOID = document.getElementById('newSOID').value;
        const internalMove = document.getElementById('internalMove').checked;
        const billingAddressUpdated = document.getElementById('billingAddressUpdated').checked;
        
        // Contract
        const cancelContract = document.getElementById('cancelContract').checked;
        const cancelContractDone = document.getElementById('cancelContractDone').checked;
        
        // Dates
        const cancelDate = document.getElementById('cancelDate').value;
        const cancelDateTBC = document.getElementById('cancelDateTBC').checked;
        const cancelWhenServiceLive = document.getElementById('cancelWhenServiceLive').checked;
        const cancelDateDone = document.getElementById('cancelDateDone').checked;
        const newServiceDate = document.getElementById('newServiceDate').value;
        
        // Router
        const newRouter = document.getElementById('newRouter').checked;
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
        let cancelDateText;
        if (cancelWhenServiceLive) {
            cancelDateText = 'When new service is live';
        } else if (cancelDateTBC) {
            cancelDateText = 'TBC'; 
        } else {
            cancelDateText = formatDate(cancelDate);
        }
        
        const formattedNewServiceDate = formatDate(newServiceDate);
        
        // Determine billing address text based on internal move
        let billingAddressText;
        if (internalMove) {
            billingAddressText = 'INTERNAL';
        } else if (billingAddressUpdated) {
            billingAddressText = 'YES';
        } else {
            billingAddressText = 'NO';
        }
        
        // Generate template
        let template = `*****MOVE ORDER*****
Has contract been removed: ${cancelContract ? 'YES' : 'N/A'} - ${cancelContract ? (cancelContractDone ? 'DONE' : 'NOT DONE') : 'N/A'}
Date to cancel old Services: ${cancelDateText} - ${cancelDateDone ? 'DONE' : 'NOT DONE'}
Transfer of tech: ${techSwap ? 'YES' : 'NO'} ${techSwap ? (techSwapDone ? 'DONE' : 'NOT DONE') : ''}
Does the user have a Zen email: ${zenEmail ? 'YES' : 'NO'}
Update billing address: ${billingAddressText}
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
    
    function generateCustomerEmail() {
        // Get relevant form values
        const oldAddress = document.getElementById('oldAddress').value;
        const newAddress = document.getElementById('newAddress').value;
        const newServiceDate = document.getElementById('newServiceDate').value;
        const formattedNewServiceDate = formatDate(newServiceDate);
        const lessThan6Months = document.getElementById('lessThan6Months').checked;
        
        // Cancel date determination
        let cancelDateText;
        if (document.getElementById('cancelWhenServiceLive').checked) {
            cancelDateText = formattedNewServiceDate + ' (when new service is live)';
        } else if (document.getElementById('cancelDateTBC').checked) {
            cancelDateText = 'To Be Confirmed';
        } else {
            cancelDateText = formatDate(document.getElementById('cancelDate').value);
        }
        
        // Engineer attendance
        const engineerAttending = document.getElementById('engineerAttending').checked;
        let engineerTimeSlot = '';
        if (engineerAttending) {
            if (document.getElementById('engineerAM').checked) {
                engineerTimeSlot = 'AM Slot (8:00 - 13:00)';
            } else if (document.getElementById('engineerPM').checked) {
                engineerTimeSlot = 'PM Slot (13:00 - 18:00)';
            }
        }
        
        // Username and IP address retention
        const zenEmail = document.getElementById('zenEmail').checked;
        const keepEmail = document.getElementById('keepEmail').checked;
        const techSwap = document.getElementById('techSwap').checked;
        
        // Router info
        const newRouter = document.getElementById('newRouter').checked;
        
        // ETC waiver
        const etcWaiver = document.getElementById('etcWaiver').checked;
        
        // Determine username/IP text based on tech swap
        let usernameIpText = '';
        if (zenEmail) {
            if (techSwap) {
                usernameIpText = `You have requested a tech swap which means your username and IP address will change.`;
            } else if (keepEmail) {
                usernameIpText = `You have requested to keep the same username & IP address.\nThe transfer of your Zen username and IP address from your existing service will take place on: ${formattedNewServiceDate}`;
            } else {
                usernameIpText = `You have requested to not keep the same username & IP address.`;
            }
        }
        
        // Generate the email based on the template
        let email = `Good Afternoon,

Hope you are well.

Thank you for placing your order with us to move your services to your new address.

I will be personally handling everything for you so that the move of your services will go smoothly.

Please check that I have the correct instructions as you requested when you spoke with my colleague on the telephone.

You have requested to cancel the services at your old address ${oldAddress} on: ${cancelDateText}

Your service at your new address ${newAddress} will be activated on: ${formattedNewServiceDate}
${engineerAttending ? 
    `An engineer is scheduled to attend your premises on the following time slot: ${engineerTimeSlot}` : 
    'This will be a remote activation meaning an engineer will not be attending your premises and will be activating your service externally'}

${newRouter ? '' : 'Please ensure to take your router with you to your new address.'}

${usernameIpText}

${lessThan6Months || etcWaiver ? 'If you are still in contract at your old address, Zen will not charge you any early termination fees as you are staying with us at your new address.' : ''}

Please check that the above details are all correct. Should you wish to make any changes or have any queries relating to your move order, please do not hesitate to contact me by replying to this email.`;

        // Display the email
        emailOutput.textContent = email;
        emailContainer.classList.remove('hidden');
        
        // Scroll to results
        emailContainer.scrollIntoView({ behavior: 'smooth' });
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
    
    function copyToClipboard(text, button) {
        navigator.clipboard.writeText(text).then(
            function() {
                // Temporarily change button text to indicate success
                const originalText = button.textContent;
                button.textContent = 'Copied!';
                button.style.backgroundColor = '#27ae60';
                
                // Revert button text after a short delay
                setTimeout(function() {
                    button.textContent = originalText;
                    button.style.backgroundColor = '#2ecc71';
                }, 2000);
            },
            function() {
                // Handle errors
                button.textContent = 'Failed to copy';
                button.style.backgroundColor = '#e74c3c';
                
                setTimeout(function() {
                    button.textContent = 'Copy to Clipboard';
                    button.style.backgroundColor = '#2ecc71';
                }, 2000);
            }
        );
    }
});