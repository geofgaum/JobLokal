let currentComm = 'All';
let appCount = 0;

const jobs = [
  { id:1, title:'Carpenter Helper', company:'Reyes Construction', comm:'Poblacion', type:'Full-Time', age:'18-25', wage:650, skills:['Carpentry'], desc:'Assist senior carpenter in residential projects. Tools provided. 8am–5pm schedule.' },
  { id:2, title:'Kusinero / Cook', company:"Aling Nena's Carinderia", comm:'Calicanto', type:'Part-Time', age:'26-35', wage:500, skills:['Cooking'], desc:'Prepare meals for daily canteen. Morning shift 5am–12nn. Experience in Filipino dishes required.' },
  { id:3, title:'Tricycle Driver', company:'Community Transport Coop', comm:'Balagtas', type:'Full-Time', age:'26-35', wage:700, skills:['Driving'], desc:'Operate tricycle within barangay routes. Must have valid license and clean record.' },
  { id:4, title:'Electrician Apprentice', company:'Dizon Electric Works', comm:'Dumantay', type:'Apprentice', age:'18-25', wage:550, skills:['Electrician'], desc:'Learn wiring and installation under supervision. OJT stipend provided. No prior experience needed.' },
  { id:5, title:'Dress & Alterations Maker', company:"Maria's Atelier", comm:'Santa Clara', type:'Freelance', age:'Any', wage:480, skills:['Sewing'], desc:'Accept alteration orders from community clients. Work from home possible. Flexible hours.' },
  { id:6, title:'Farm Hand – Rice Field', company:'Santos Agri Farm', comm:'Tabangao Ambulong', type:'Full-Time', age:'36-45', wage:520, skills:['Farming'], desc:'Planting and harvesting season work. 3-month seasonal contract. Meals included during field days.' },
];

function renderJobs(list) {
  const el = document.getElementById('jobList');
  const empty = document.getElementById('emptyState');
  document.getElementById('statJobs').textContent = jobs.length;
  if (!list.length) { el.innerHTML=''; empty.style.display='block'; return; }
  empty.style.display='none';
  el.innerHTML = list.map(j => `
    <div class="job-card">
      <div class="job-top">
        <div class="job-info">
          <div class="job-title">${j.title}</div>
          <div class="job-company">${j.company}</div>
        </div>
      </div>
      <div class="job-meta">
        <span class="badge badge-comm">${j.comm}</span>
        <span class="badge badge-type">${j.type}</span>
        <span class="badge badge-age">Age: ${j.age}</span>
        ${j.skills.map(s=>`<span class="badge badge-skill">${s}</span>`).join('')}
      </div>
      ${j.desc ? `<p style="color:var(--muted);font-size:.85rem;margin-top:10px;line-height:1.5">${j.desc}</p>` : ''}
      <div class="job-bottom">
        <div class="job-wage">₱${j.wage}/day</div>
        <div class="job-actions">
          <button class="btn-save" onclick="saveJob(${j.id})">Save</button>
          <button class="btn-apply" onclick="openApply(${j.id})">Apply Now →</button>
        </div>
      </div>
    </div>
  `).join('');
}

function applyFilters() {
  const q = document.getElementById('searchInput').value.toLowerCase();
  const age = document.getElementById('ageFilter').value;
  const type = document.getElementById('typeFilter').value;
  const skill = document.getElementById('skillFilter').value;
  const wage = parseInt(document.getElementById('wageFilter').value)||0;
  const filtered = jobs.filter(j => {
    const matchComm = currentComm==='All'||j.comm===currentComm;
    const matchQ = !q||j.title.toLowerCase().includes(q)||j.skills.join(' ').toLowerCase().includes(q)||j.company.toLowerCase().includes(q);
    const matchAge = !age||j.age===age||j.age==='Any';
    const matchType = !type||j.type===type;
    const matchSkill = !skill||j.skills.includes(skill);
    const matchWage = !wage||j.wage>=wage;
    return matchComm&&matchQ&&matchAge&&matchType&&matchSkill&&matchWage;
  });
  renderJobs(filtered);
}

function filterCommunity(el, comm) {
  document.querySelectorAll('.comm-chip').forEach(c=>c.classList.remove('active'));
  el.classList.add('active');
  // Reset dropdown when chip is clicked
  document.getElementById('communitySelect').value = '';
  currentComm = comm;
  applyFilters();
}

function filterCommunityBySelect(selectEl) {
  const comm = selectEl.value;
  if (!comm) return; // Don't filter if "More Communities..." is selected
  
  // Remove active class from chips
  document.querySelectorAll('.comm-chip').forEach(c=>c.classList.remove('active'));
  currentComm = comm;
  applyFilters();
}

function openTab(name) {
  document.getElementById('panel-find').style.display = name==='find'?'block':'none';
  document.getElementById('panel-skill').style.display = name==='skill'?'block':'none';
  document.querySelectorAll('.tab-btn').forEach(b=>b.classList.remove('active'));
  document.getElementById('tab-'+name).classList.add('active');
}

function openModal(id) { document.getElementById(id).classList.add('open'); }

function closeModal(id) {
  document.getElementById(id).classList.remove('open');
  setTimeout(()=>{
    const ps=document.getElementById('post-success'); if(ps){ps.style.display='none';}
    const pf=document.getElementById('post-form-wrap'); if(pf){pf.style.display='block';}
    const as=document.getElementById('apply-success'); if(as){as.style.display='none';}
    const af=document.getElementById('apply-form-wrap'); if(af){af.style.display='block';}
  },300);
}

document.querySelectorAll('.modal-overlay').forEach(m=>m.addEventListener('click',e=>{if(e.target===m)closeModal(m.id);}));

function openApply(id) {
  const job = jobs.find(j=>j.id===id);
  if(job) document.getElementById('apply-job-title').textContent=`Applying for: ${job.title} at ${job.company}`;
  openModal('apply-modal');
}

function postJob() {
  const title=document.getElementById('p-title').value.trim();
  const comm=document.getElementById('p-comm').value;
  if(!title||!comm){showToast('⚠️ Please fill in required fields');return;}
  const newJob={
    id:Date.now(),title,
    company:document.getElementById('p-company').value||'Anonymous',
    comm,type:document.getElementById('p-type').value,
    age:document.getElementById('p-age').value||'Any',
    wage:parseInt(document.getElementById('p-wage').value)||450,
    skills:document.getElementById('p-skill').value?[document.getElementById('p-skill').value]:[],
    emoji:emojis[Math.floor(Math.random()*emojis.length)],
    desc:document.getElementById('p-desc').value
  };
  jobs.unshift(newJob);
  document.getElementById('post-form-wrap').style.display='none';
  document.getElementById('post-success').style.display='block';
  document.getElementById('statJobs').textContent=jobs.length;
  setTimeout(()=>{closeModal('post-modal');applyFilters();},2000);
}

function submitApplication() {
  const name=document.getElementById('a-name').value.trim();
  const age=document.getElementById('a-age').value;
  if(!name||!age){showToast('⚠️ Please fill in required fields');return;}
  appCount++;
  document.getElementById('statApps').textContent=appCount;
  document.getElementById('apply-form-wrap').style.display='none';
  document.getElementById('apply-success').style.display='block';
  setTimeout(()=>closeModal('apply-modal'),2200);
}

function saveJob(id) { showToast('🔖 Job saved to your list!'); }

const skillMap = {
  'Carpentry':{ missing:['Safety Protocols','Blueprint Reading'], courses:[{icon:'🎓',title:'Basic Construction Safety – TESDA',meta:'Free · 2 days',free:true},{icon:'📐',title:'Blueprint Reading Basics',meta:'₱199 · Online',free:false}] },
  'Cooking':{ missing:['Food Safety & Hygiene','Menu Costing'], courses:[{icon:'🍽️',title:'Food Safety NC II – TESDA',meta:'Free · 3 days',free:true}] },
  'Driving':{ missing:['Defensive Driving','Vehicle Maintenance'], courses:[{icon:'🚗',title:'Defensive Driving Course – LTO',meta:'Free · 1 day',free:true}] },
  'Electrician':{ missing:['PEC Standards','Solar Wiring'], courses:[{icon:'⚡',title:'Electrical Installation NC II – TESDA',meta:'Free',free:true}] },
  'Sewing':{ missing:['Pattern Making','Garment Costing'], courses:[{icon:'✂️',title:'Dressmaking NC II – TESDA',meta:'Free · 5 days',free:true}] },
  'IT':{ missing:['Cybersecurity Basics','Cloud Computing'], courses:[{icon:'💻',title:'Google IT Support Certificate',meta:'Free trial · Coursera',free:true}] },
  'Farming':{ missing:['Organic Farming','Crop Disease Mgmt'], courses:[{icon:'🌱',title:'Organic Agriculture NC II – TESDA',meta:'Free · 4 days',free:true}] },
  'Plumbing':{ missing:['Pipefitting','Water Systems Design'], courses:[{icon:'🔧',title:'Plumbing NC II – TESDA',meta:'Free · 5 days',free:true}] },
};

function runSkillGap() {
  let s1 = document.getElementById('mySkill1').value;
  let s2 = document.getElementById('mySkill2').value;
  
  // Check for custom skills
  const customSkill1 = document.getElementById('customSkill1').value.trim();
  const customSkill2 = document.getElementById('customSkill2').value.trim();
  
  if (customSkill1) s1 = customSkill1;
  if (customSkill2) s2 = customSkill2;
  
  if(!s1){showToast('⚠️ Pick at least one skill');return;}
  const have=[s1,s2].filter(Boolean);
  const allSkills=Object.keys(skillMap);
  const missing=allSkills.filter(s=>!have.includes(s)).slice(0,4);
  const courses=have.flatMap(s=>skillMap[s]?.courses||[]);
  document.getElementById('haveSkills').innerHTML=have.map(s=>`<span class="skill-item have">✓ ${s}</span>`).join('');
  document.getElementById('needSkills').innerHTML=missing.map(s=>`<span class="skill-item need">+ ${s}</span>`).join('');
  document.getElementById('courseRecs').innerHTML=courses.length?courses.map(c=>`
    <div class="course-card">
      <div class="course-icon">${c.icon}</div>
      <div class="course-info"><div class="course-title">${c.title}</div><div class="course-meta">${c.meta}</div></div>
      ${c.free?'<span class="course-free">FREE</span>':''}
    </div>`).join(''):'<p style="color:var(--muted);font-size:.875rem">No courses mapped yet.</p>';
  document.getElementById('skillGapResult').style.display='block';
}

function showToast(msg) {
  const t=document.getElementById('toast');
  t.textContent=msg; t.classList.add('show');
  setTimeout(()=>t.classList.remove('show'),2800);
}

// Handle custom skill selection
document.getElementById('mySkill1').addEventListener('change', function() {
  handleCustomSkill(this, 'customSkill1');
});

document.getElementById('mySkill2').addEventListener('change', function() {
  handleCustomSkill(this, 'customSkill2');
});

function handleCustomSkill(selectElement, customInputId) {
  const customInput = document.getElementById(customInputId);
  const customRow = document.getElementById('customSkillRow');
  
  if (selectElement.value === 'custom') {
    customInput.style.display = 'block';
    customRow.style.display = 'flex';
    customInput.focus();
    // Clear the select value so it doesn't interfere
    selectElement.value = '';
  } else {
    customInput.style.display = 'none';
    // Hide the row if both custom inputs are hidden
    const customSkill1 = document.getElementById('customSkill1');
    const customSkill2 = document.getElementById('customSkill2');
    if (customSkill1.style.display === 'none' && customSkill2.style.display === 'none') {
      customRow.style.display = 'none';
    }
  }
}

renderJobs(jobs);
