const API_BASE = '/api/v1';

document.addEventListener('DOMContentLoaded', () => {
    const form = document.getElementById('urlForm');
    const statusMsg = document.getElementById('statusMessage');
    const refreshBtn = document.getElementById('refreshBtn');
    
    // Initial load
    fetchDossiers();

    form.addEventListener('submit', async (e) => {
        e.preventDefault();
        const url = document.getElementById('urlInput').value;
        const type = document.getElementById('sourceType').value;
        const btn = form.querySelector('button');

        try {
            btn.disabled = true;
            btn.textContent = 'Submitting...';
            
            const res = await fetch(`${API_BASE}/urls`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ url, sourceType: type, priority: 8 })
            });
            
            const data = await res.json();
            
            if (res.ok) {
                showStatus(`Job submitted successfully! ID: ${data.jobId}`, 'success');
                form.reset();
                // Start polling for new dossiers
                setTimeout(fetchDossiers, 5000);
            } else {
                showStatus(`Error: ${data.error}`, 'error');
            }
        } catch (err) {
            showStatus(`Network error: ${err.message}`, 'error');
        } finally {
            btn.disabled = false;
            btn.textContent = 'Generate Dossier';
        }
    });

    refreshBtn.addEventListener('click', fetchDossiers);
});

async function fetchDossiers() {
    try {
        const res = await fetch(`${API_BASE}/dossiers?limit=20`);
        const data = await res.json();
        renderDossiers(data.dossiers || []);
    } catch (err) {
        console.error('Failed to fetch dossiers:', err);
    }
}

function renderDossiers(dossiers) {
    const list = document.getElementById('dossierList');
    list.innerHTML = '';

    if (dossiers.length === 0) {
        list.innerHTML = '<p class="empty-state">No dossiers found.</p>';
        return;
    }

    dossiers.forEach(d => {
        const card = document.createElement('div');
        card.className = 'dossier-card';
        card.innerHTML = `
            <div class="dossier-header">
                <span class="status-badge status-${d.status}">${d.status.replace('_', ' ')}</span>
                <span class="score">${(d.score * 100).toFixed(0)}</span>
            </div>
            <div class="dossier-title" title="${d.metadata?.title || 'Untitled'}">${d.metadata?.title || 'Untitled Dossier'}</div>
            <div class="dossier-meta">
                <div>Source: <a href="${d.url}" target="_blank" rel="noopener noreferrer">${new URL(d.url).hostname}</a></div>
                <div>Generated: ${new Date(d.generatedAt).toLocaleDateString()}</div>
            </div>
            <button onclick="viewDossier('${d.id}')">View Full Dossier</button>
        `;
        list.appendChild(card);
    });
}

window.viewDossier = async (id) => {
    try {
        const res = await fetch(`${API_BASE}/dossiers/${id}/markdown`);
        const text = await res.text();
        
        const modal = document.getElementById('dossierModal');
        const body = document.getElementById('modalBody');
        
        // Simple markdown rendering (safe subset)
        body.innerHTML = `<div class="markdown-body"><pre>${text}</pre></div>`; 
        // In a real app we'd use a markdown library, but raw text in pre is fine for verification
        
        modal.classList.remove('hidden');
        
        modal.querySelector('.close-modal').onclick = () => {
            modal.classList.add('hidden');
        };
        
        window.onclick = (e) => {
            if (e.target === modal) modal.classList.add('hidden');
        };
    } catch (err) {
        alert('Failed to load dossier');
    }
};

function showStatus(msg, type) {
    const el = document.getElementById('statusMessage');
    el.textContent = msg;
    el.className = type === 'error' ? 'error-msg' : 'success-msg';
    el.style.display = 'block';
    setTimeout(() => el.style.display = 'none', 5000);
}
