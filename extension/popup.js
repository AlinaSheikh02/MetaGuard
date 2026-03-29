document.addEventListener('DOMContentLoaded', () => {
    const fileInput = document.getElementById('file-input');
    const uploadArea = document.querySelector('.upload-area');
    const fileDetails = document.getElementById('file-details');
    const filenameDisplay = document.getElementById('filename');
    const analyzeBtn = document.getElementById('analyze-btn');
    const statusDiv = document.getElementById('status');
    const shareSafeCheckbox = document.getElementById('share-safe-checkbox');
    
    // Result view
    const uploadView = document.getElementById('upload-view');
    const resultView = document.getElementById('result-view');
    const backBtn = document.getElementById('back-btn');
    const scoreDisplay = document.getElementById('score-display');
    const riskDisplay = document.getElementById('risk-display');
    const metaCount = document.getElementById('meta-count');
    const downloadLink = document.getElementById('download-link');

    let currentFile = null;

    fileInput.addEventListener('change', (e) => {
        if (e.target.files.length > 0) {
            currentFile = e.target.files[0];
            filenameDisplay.textContent = currentFile.name;
            uploadArea.classList.add('hidden');
            fileDetails.classList.remove('hidden');
            statusDiv.textContent = '';
        }
    });

    backBtn.addEventListener('click', () => {
        currentFile = null;
        fileInput.value = '';
        uploadArea.classList.remove('hidden');
        fileDetails.classList.add('hidden');
        uploadView.classList.remove('hidden');
        resultView.classList.add('hidden');
        statusDiv.textContent = '';
    });

    analyzeBtn.addEventListener('click', async () => {
        if (!currentFile) return;

        analyzeBtn.disabled = true;
        analyzeBtn.textContent = 'Analyzing...';
        statusDiv.textContent = 'Uploading to local sandbox...';

        const formData = new FormData();
        formData.append('file', currentFile);
        formData.append('share_safe', shareSafeCheckbox.checked ? 'true' : 'false');

        try {
            const response = await fetch('http://127.0.0.1:5000/api/analyze', {
                method: 'POST',
                body: formData
            });

            const data = await response.json();

            if (!response.ok) {
                throw new Error(data.error || 'Failed to analyze file');
            }

            // Display results
            uploadView.classList.add('hidden');
            resultView.classList.remove('hidden');

            scoreDisplay.textContent = data.score;
            scoreDisplay.className = `result-score ${data.risk_level === 'High' || data.risk_level === 'Critical' ? 'high-risk' : data.risk_level === 'Medium' ? 'med-risk' : 'low-risk'}`;
            
            riskDisplay.textContent = data.risk_level + ' Risk';
            riskDisplay.style.borderColor = data.risk_level === 'High' ? '#f87171' : data.risk_level === 'Medium' ? '#fbbf24' : '#4ade80';
            riskDisplay.style.color = riskDisplay.style.borderColor;
            
            metaCount.textContent = `Found ${data.metadata.length} metadata properties`;
            
            downloadLink.href = `http://127.0.0.1:5000${data.clean_url}`;
            downloadLink.textContent = `Download Clean ${currentFile.name.split('.').pop().toUpperCase()}`;

        } catch (err) {
            statusDiv.textContent = `Error: ${err.message}`;
            statusDiv.style.color = '#f87171';
        } finally {
            analyzeBtn.disabled = false;
            analyzeBtn.textContent = 'Analyze & Clean';
        }
    });
});
