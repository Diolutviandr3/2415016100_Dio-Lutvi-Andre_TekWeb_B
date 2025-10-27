// Variabel global untuk melacak tugas yang sedang diedit
let editingTaskId = null;

// Fungsi untuk menambah tugas baru
function addTask() {
    const input = document.getElementById('newTask');
    const taskText = input.value.trim();
    
    if (taskText === '') {
        alert('Silakan masukkan tugas!');
        return;
    }
    
    const taskList = document.getElementById('taskList');
    const taskId = Date.now().toString(); // ID unik berdasarkan timestamp
    
    // Buat elemen tugas baru
    const taskItem = document.createElement('li');
    taskItem.className = 'task-item';
    taskItem.id = taskId;
    taskItem.innerHTML = `
        <div class="task-content">
            <input type="checkbox" class="task-checkbox" onchange="toggleTask(this)">
            <span class="task-text">${taskText}</span>
        </div>
        <div class="task-actions">
            <button class="edit-btn" onclick="enableEdit('${taskId}')" title="Edit">
                <i class="fas fa-edit"></i>
            </button>
            <button class="delete-btn" onclick="deleteTask(this)" title="Hapus">
                <i class="fas fa-trash"></i>
            </button>
        </div>
    `;
    
    // Tambahkan ke daftar
    taskList.appendChild(taskItem);
    
    // Kosongkan input
    input.value = '';
    input.focus();
    
    // Simpan ke localStorage
    saveTasks();
    updateStats();
}

// Fungsi untuk menghapus tugas
function deleteTask(button) {
    const taskItem = button.closest('.task-item');
    taskItem.style.opacity = '0';
    taskItem.style.transform = 'translateX(20px)';
    
    setTimeout(() => {
        taskItem.remove();
        saveTasks();
        updateStats();
    }, 300);
}

// Fungsi untuk menandai tugas selesai
function toggleTask(checkbox) {
    const taskItem = checkbox.closest('.task-item');
    const taskText = taskItem.querySelector('.task-text');
    
    taskItem.classList.toggle('completed');
    taskText.classList.toggle('completed');
    saveTasks();
    updateStats();
}

// Fungsi untuk mengaktifkan mode edit
function enableEdit(taskId) {
    // Nonaktifkan mode edit sebelumnya jika ada
    if (editingTaskId) {
        disableEdit(editingTaskId);
    }
    
    const taskItem = document.getElementById(taskId);
    const taskText = taskItem.querySelector('.task-text');
    const currentText = taskText.textContent;
    
    // Ganti teks dengan input field
    taskItem.innerHTML = `
        <div class="task-content">
            <input type="checkbox" class="task-checkbox" onchange="toggleTask(this)">
            <input type="text" class="edit-input" value="${currentText}">
        </div>
        <div class="task-actions">
            <button class="save-btn" onclick="saveEdit('${taskId}')" title="Simpan">
                <i class="fas fa-check"></i>
            </button>
            <button class="cancel-btn" onclick="cancelEdit('${taskId}', '${currentText}')" title="Batal">
                <i class="fas fa-times"></i>
            </button>
        </div>
    `;
    
    // Fokus ke input field
    const editInput = taskItem.querySelector('.edit-input');
    editInput.focus();
    editInput.select();
    
    // Simpan ID tugas yang sedang diedit
    editingTaskId = taskId;
}

// Fungsi untuk menyimpan perubahan edit
function saveEdit(taskId) {
    const taskItem = document.getElementById(taskId);
    const editInput = taskItem.querySelector('.edit-input');
    const newText = editInput.value.trim();
    
    if (newText === '') {
        alert('Teks tugas tidak boleh kosong!');
        return;
    }
    
    // Dapatkan status selesai sebelumnya
    const wasCompleted = taskItem.classList.contains('completed');
    
    // Kembalikan ke tampilan normal dengan teks baru
    taskItem.innerHTML = `
        <div class="task-content">
            <input type="checkbox" class="task-checkbox" onchange="toggleTask(this)" ${wasCompleted ? 'checked' : ''}>
            <span class="task-text ${wasCompleted ? 'completed' : ''}">${newText}</span>
        </div>
        <div class="task-actions">
            <button class="edit-btn" onclick="enableEdit('${taskId}')" title="Edit">
                <i class="fas fa-edit"></i>
            </button>
            <button class="delete-btn" onclick="deleteTask(this)" title="Hapus">
                <i class="fas fa-trash"></i>
            </button>
        </div>
    `;
    
    // Kembalikan status selesai
    if (wasCompleted) {
        taskItem.classList.add('completed');
    }
    
    // Reset ID tugas yang sedang diedit
    editingTaskId = null;
    
    // Simpan ke localStorage
    saveTasks();
}

// Fungsi untuk membatalkan edit
function cancelEdit(taskId, originalText) {
    const taskItem = document.getElementById(taskId);
    
    // Dapatkan status selesai sebelumnya
    const wasCompleted = taskItem.classList.contains('completed');
    
    // Kembalikan ke tampilan normal dengan teks asli
    taskItem.innerHTML = `
        <div class="task-content">
            <input type="checkbox" class="task-checkbox" onchange="toggleTask(this)" ${wasCompleted ? 'checked' : ''}>
            <span class="task-text ${wasCompleted ? 'completed' : ''}">${originalText}</span>
        </div>
        <div class="task-actions">
            <button class="edit-btn" onclick="enableEdit('${taskId}')" title="Edit">
                <i class="fas fa-edit"></i>
            </button>
            <button class="delete-btn" onclick="deleteTask(this)" title="Hapus">
                <i class="fas fa-trash"></i>
            </button>
        </div>
    `;
    
    // Reset ID tugas yang sedang diedit
    editingTaskId = null;
}

// Fungsi untuk mengubah warna tema
function changeColor(primary, secondary) {
    document.documentElement.style.setProperty('--primary-color', primary);
    document.documentElement.style.setProperty('--secondary-color', secondary);
    
    // Simpan ke localStorage
    localStorage.setItem('primaryColor', primary);
    localStorage.setItem('secondaryColor', secondary);
    
    // Sembunyikan panel warna
    document.getElementById('colorPanel').style.display = 'none';
}

// Fungsi untuk menampilkan/menyembunyikan panel warna
function toggleColorPicker() {
    const colorPanel = document.getElementById('colorPanel');
    if (colorPanel.style.display === 'block') {
        colorPanel.style.display = 'none';
    } else {
        colorPanel.style.display = 'block';
    }
}

// Fungsi untuk mengaktifkan/menonaktifkan mode gelap
function toggleDarkMode() {
    document.body.classList.toggle('dark-mode');
    
    // Perbarui teks tombol
    const darkModeBtn = document.querySelector('.dark-mode-btn .btn-text');
    if (document.body.classList.contains('dark-mode')) {
        darkModeBtn.textContent = 'Mode Terang';
        localStorage.setItem('darkMode', 'enabled');
    } else {
        darkModeBtn.textContent = 'Mode Gelap';
        localStorage.setItem('darkMode', 'disabled');
    }
}

// Fungsi untuk memperbarui statistik tugas
function updateStats() {
    const totalTasks = document.querySelectorAll('.task-item').length;
    const completedTasks = document.querySelectorAll('.task-item.completed').length;
    
    document.getElementById('totalTasks').textContent = `Total: ${totalTasks} tugas`;
    document.getElementById('completedTasks').textContent = `Selesai: ${completedTasks}`;
    
    // Tampilkan pesan jika tidak ada tugas
    const taskList = document.getElementById('taskList');
    if (totalTasks === 0) {
        if (!document.querySelector('.empty-state')) {
            const emptyState = document.createElement('div');
            emptyState.className = 'empty-state';
            emptyState.innerHTML = `
                <i class="fas fa-clipboard-list"></i>
                <p>Belum ada tugas. Tambahkan tugas pertama Anda!</p>
            `;
            taskList.appendChild(emptyState);
        }
    } else {
        const emptyState = document.querySelector('.empty-state');
        if (emptyState) {
            emptyState.remove();
        }
    }
}

// Fungsi untuk menyimpan tugas ke localStorage
function saveTasks() {
    const tasks = [];
    const taskItems = document.querySelectorAll('.task-item');
    
    taskItems.forEach(item => {
        const text = item.querySelector('.task-text').textContent;
        const completed = item.classList.contains('completed');
        const id = item.id;
        tasks.push({ id, text, completed });
    });
    
    localStorage.setItem('tasks', JSON.stringify(tasks));
}

// Fungsi untuk memuat tugas dari localStorage
function loadTasks() {
    const tasks = JSON.parse(localStorage.getItem('tasks')) || [];
    const taskList = document.getElementById('taskList');
    
    tasks.forEach(task => {
        const taskItem = document.createElement('li');
        taskItem.className = 'task-item';
        if (task.completed) {
            taskItem.classList.add('completed');
        }
        taskItem.id = task.id;
        
        const completedClass = task.completed ? 'completed' : '';
        
        taskItem.innerHTML = `
            <div class="task-content">
                <input type="checkbox" class="task-checkbox" onchange="toggleTask(this)" ${task.completed ? 'checked' : ''}>
                <span class="task-text ${completedClass}">${task.text}</span>
            </div>
            <div class="task-actions">
                <button class="edit-btn" onclick="enableEdit('${task.id}')" title="Edit">
                    <i class="fas fa-edit"></i>
                </button>
                <button class="delete-btn" onclick="deleteTask(this)" title="Hapus">
                    <i class="fas fa-trash"></i>
                </button>
            </div>
        `;
        
        taskList.appendChild(taskItem);
    });
}

// Fungsi untuk memuat preferensi tema
function loadPreferences() {
    // Muat warna yang disimpan
    const savedPrimary = localStorage.getItem('primaryColor');
    const savedSecondary = localStorage.getItem('secondaryColor');
    
    if (savedPrimary && savedSecondary) {
        document.documentElement.style.setProperty('--primary-color', savedPrimary);
        document.documentElement.style.setProperty('--secondary-color', savedSecondary);
    }
    
    // Muat mode gelap
    if (localStorage.getItem('darkMode') === 'enabled') {
        document.body.classList.add('dark-mode');
        document.querySelector('.dark-mode-btn .btn-text').textContent = 'Mode Terang';
    }
}

// Event listener untuk menambah tugas dengan tombol Enter
document.getElementById('newTask').addEventListener('keypress', function(e) {
    if (e.key === 'Enter') {
        addTask();
    }
});

// Tutup panel warna saat klik di luar panel
document.addEventListener('click', function(event) {
    const colorPanel = document.getElementById('colorPanel');
    const colorPickerToggle = document.querySelector('.color-picker-toggle');
    
    if (colorPanel.style.display === 'block' && 
        !colorPanel.contains(event.target) && 
        !colorPickerToggle.contains(event.target)) {
        colorPanel.style.display = 'none';
    }
});

// Muat data saat halaman dimuat
window.onload = function() {
    loadTasks();
    loadPreferences();
    updateStats();
};