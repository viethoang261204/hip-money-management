(() => {
	const modalEl = document.getElementById('confirmDeleteModal');
	if (!modalEl) return;
	const modal = new bootstrap.Modal(modalEl);
	const msgEl = document.getElementById('confirmDeleteMessage');
	const confirmBtn = document.getElementById('confirmDeleteBtn');
	let pendingForm = null;

	document.addEventListener('click', (e) => {
		const btn = e.target.closest('button[data-confirm]');
		if (!btn) return;
		const form = btn.closest('form');
		if (!form) return;
		e.preventDefault();
		pendingForm = form;
		msgEl.textContent = btn.getAttribute('data-message') || 'Bạn có chắc muốn xoá mục này?';
		modal.show();
	});

	confirmBtn?.addEventListener('click', () => {
		if (pendingForm) {
			pendingForm.submit();
			pendingForm = null;
			modal.hide();
		}
	});
})();

// VND input formatting: display with dots while typing, submit as raw number
(() => {
	function parseNumber(value) {
		if (typeof value !== 'string') return value;
		return value.replace(/[^0-9\-]/g, '');
	}
	function formatVND(value) {
		const s = parseNumber(value);
		if (!s) return '';
		const n = Number(s);
		if (!Number.isFinite(n)) return '';
		return n.toLocaleString('vi-VN');
	}
	function attachFormatter(input) {
		let last = '';
		input.addEventListener('input', () => {
			const pos = input.selectionStart;
			const before = input.value;
			const formatted = formatVND(before);
			if (formatted !== before) {
				input.value = formatted;
				// best-effort caret keep
				const diff = formatted.length - before.length;
				input.setSelectionRange(Math.max(0, (pos || 0) + diff), Math.max(0, (pos || 0) + diff));
			}
			last = input.value;
		});
		// On form submit, strip formatting so backend receives plain number
		const form = input.form;
		if (form) {
			form.addEventListener('submit', () => {
				const raw = parseNumber(input.value);
				input.value = raw || '';
			});
		}
	}
	const selector = 'input[data-vnd], input.vnd';
	const inputs = document.querySelectorAll(selector);
	inputs.forEach(attachFormatter);
})();


