const saveBtn = document.getElementById('save-btn');
const showSavedBtn = document.getElementById('show-saved-btn');
const saveModal = document.getElementById('save-modal');
const listModal = document.getElementById('list-modal');
const confirmSave = document.getElementById('confirm-save');
const cancelSave = document.getElementById('cancel-save');
const closeList = document.getElementById('close-list');
const saveURLTextarea = document.getElementById('save-url');
const saveDescInput = document.getElementById('save-description');
const savedList = document.getElementById('saved-list');

function getItems() {
    return JSON.parse(localStorage.getItem('utm_urls') || '[]');
}

function setItems(items) {
    localStorage.setItem('utm_urls', JSON.stringify(items));
}

function renderSavedList() {
    savedList.innerHTML = '';
    const items = getItems();
    if (items.length === 0) {
        savedList.innerHTML = '<li class="text-gray-500">No saved URLs.</li>';
    } else {
        items.forEach(({ desc, url }, index) => {
            const li = document.createElement('li');
            li.classList.add('border', 'border-gray-200', 'rounded', 'p-4');
            li.innerHTML = `
        <div class="flex flex-col sm:flex-row sm:justify-between sm:items-start gap-2">
          <div class="flex-1">
            <input type="text" class="desc-input w-full font-semibold text-gray-800 mb-1 border border-gray-200 rounded px-2 py-1" value="${desc}" data-index="${index}" />
            <div class="flex items-center gap-2">
              <input type="text" class="url-copy-input flex-1 border border-gray-200 rounded px-2 py-1 text-sm text-blue-600" value="${url}" readonly />
              <button class="copy-link text-xs bg-black text-white px-2 py-1 rounded hover:bg-gray-800" data-url="${url}">Copy</button>
            </div>
          </div>
          <button data-index="${index}" class="delete-btn text-red-600 hover:text-red-800 text-xs">Delete</button>
        </div>`;
            savedList.appendChild(li);
        });

        // Bind delete buttons
        document.querySelectorAll('.delete-btn').forEach(btn => {
            btn.addEventListener('click', function () {
                const index = parseInt(this.dataset.index);
                const updated = getItems();
                updated.splice(index, 1);
                setItems(updated);
                renderSavedList();
            });
        });

        // Bind copy buttons
        document.querySelectorAll('.copy-link').forEach(btn => {
            btn.addEventListener('click', function () {
                navigator.clipboard.writeText(this.dataset.url);
                this.innerText = 'Copied';
                setTimeout(() => { this.innerText = 'Copy'; }, 1500);
            });
        });

        // Bind description input updates
        document.querySelectorAll('.desc-input').forEach(input => {
            input.addEventListener('change', function () {
                const index = parseInt(this.dataset.index);
                const updated = getItems();
                updated[index].desc = this.value;
                setItems(updated);
            });
        });
    }
}

saveBtn.addEventListener('click', () => {
    saveDescInput.value = '';
    saveURLTextarea.value = document.getElementById('utm-url').value;
    saveModal.classList.remove('hidden');
    saveModal.classList.add('flex');
});

cancelSave.addEventListener('click', () => {
    saveModal.classList.add('hidden');
});

confirmSave.addEventListener('click', () => {
    const desc = saveDescInput.value.trim();
    const url = saveURLTextarea.value.trim();
    if (desc && url) {
        const items = getItems();
        items.push({ desc, url });
        setItems(items);
        saveModal.classList.add('hidden');
    }
});

showSavedBtn.addEventListener('click', () => {
    renderSavedList();
    listModal.classList.remove('hidden');
    listModal.classList.add('flex');
});

closeList.addEventListener('click', () => {
    listModal.classList.add('hidden');
});

const explainers = {
    source: "The <b>Source</b> (utm_source) identifies where your traffic comes from. Example: <i>newsletter</i>, <i>facebook</i>, <i>google</i>.",
    medium: "The <b>Medium</b> (utm_medium) describes the marketing channel. Example: <i>email</i>, <i>cpc</i> (cost per click), <i>banner</i>.",
    campaign: "The <b>Campaign</b> (utm_campaign) is the name of your promotion or campaign. Example: <i>spring_sale</i>, <i>launch2025</i>.",
    term: "The <b>Term</b> (utm_term) is used for paid search keywords. Example: <i>running+shoes</i>.",
    content: "The <b>Content</b> (utm_content) helps differentiate ads or links pointing to the same URL. Example: <i>banner_ad</i>, <i>textlink</i>."
};
document.getElementById('explain-source').innerHTML = explainers.source;
document.getElementById('explain-medium').innerHTML = explainers.medium;
document.getElementById('explain-campaign').innerHTML = explainers.campaign;
document.getElementById('explain-term').innerHTML = explainers.term;
document.getElementById('explain-content').innerHTML = explainers.content;

// Live UTM generation
const form = document.getElementById('utm-form');
const urlOutput = document.getElementById('utm-url');
function generateUTMUrl() {
    const base = document.getElementById('base-url').value.trim();
    const params = [];
    function addParam(key, value) {
        if (value) {
            let v = `${key}=${encodeURIComponent(value)}`;
            v = v.replace(/%7B/g, '{').replace(/%7D/g, '}');
            params.push(v);
        }
    }
    addParam('utm_source', document.getElementById('utm-source').value);
    addParam('utm_medium', document.getElementById('utm-medium').value);
    addParam('utm_campaign', document.getElementById('utm-campaign').value);
    addParam('utm_term', document.getElementById('utm-term').value);
    addParam('utm_content', document.getElementById('utm-content').value);

    if (!base) {
        urlOutput.value = '';
        return;
    }
    // Handle if base URL already has query params
    let sep = base.includes('?') ? '&' : '?';
    urlOutput.value = base + (params.length ? sep + params.join('&') : '');
}
form.addEventListener('input', generateUTMUrl);
generateUTMUrl();

// Copy to clipboard
document.getElementById('copy-btn').addEventListener('click', function (e) {
    e.preventDefault();
    urlOutput.select();
    document.execCommand('copy');
    document.getElementById('copied-msg').classList.remove('hidden');
    setTimeout(() => {
        document.getElementById('copied-msg').classList.add('hidden');
    }, 1300);
});


const platformPresets = {
    custom: {
        source: '',
        medium: '',
        campaign: '',
        term: '',
        content: ''
    },
    google: {
        source: 'google',
        medium: 'cpc',
        campaign: '{campaignid}',
        term: '{keyword}',
        content: '{adgroupid}'
    },
    facebook: {
        source: 'facebook',
        medium: 'cpc',
        campaign: '{{campaign.name}}',
        term: '{{adset.name}}',
        content: '{{ad.name}}'
    },
    instagram: {
        source: 'instagram',
        medium: 'cpc',
        campaign: '{{campaign.name}}',
        term: '{{adset.name}}',
        content: '{{ad.name}}'
    },
    tiktok: {
        source: '__PLACEMENT__',
        medium: 'cpc',
        campaign: '__CAMPAIGN_NAME__',
        term: '__AID__',
        content: '__CID_NAME__'
    },
    linkedin: {
        source: 'linkedin',
        medium: 'cpc',
        campaign: '{CAMPAIGN_GROUP_NAME}',
        term: '{CAMPAIGN_NAME}',
        content: '{CREATIVE_ID}'
    },
    reddit: {
        source: 'reddit',
        medium: 'cpc',
        campaign: '{campaign}',
        term: '{targeting}',
        content: '{ad_id}'
    },
    x: {
        source: 'twitter',
        medium: 'cpc',
        campaign: '{campaign_name}',
        term: '{line_item_name}',
        content: '{creative_id}'
    }
};

document.querySelectorAll('.utm-shortcut').forEach(btn => {
    btn.addEventListener('click', function () {
        const p = platformPresets[this.dataset.platform];
        if (!p) return;
        document.getElementById('utm-source').value = p.source;
        document.getElementById('utm-medium').value = p.medium;
        document.getElementById('utm-campaign').value = p.campaign;
        document.getElementById('utm-term').value = p.term;
        document.getElementById('utm-content').value = p.content;
        generateUTMUrl(); // call the existing function to update the URL
    });
});