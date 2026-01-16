/**
 * Proxa Dropdown
 * Toggle dropdown menus
 */

export function initDropdowns() {
    document.addEventListener('click', (e) => {
        // Close all dropdowns when clicking outside
        if (!e.target.closest('.dropdown')) {
            document.querySelectorAll('.dropdown__menu.open').forEach(menu => {
                menu.classList.remove('open');
            });
        }
    });

    // Toggle dropdown on button click
    document.querySelectorAll('.dropdown').forEach(dropdown => {
        const trigger = dropdown.querySelector('.btn, .dropdown__trigger');
        const menu = dropdown.querySelector('.dropdown__menu');

        if (trigger && menu) {
            trigger.addEventListener('click', (e) => {
                e.stopPropagation();

                // Close other dropdowns
                document.querySelectorAll('.dropdown__menu.open').forEach(m => {
                    if (m !== menu) m.classList.remove('open');
                });

                menu.classList.toggle('open');
            });
        }
    });
}

export function openDropdown(dropdown) {
    const menu = dropdown.querySelector('.dropdown__menu');
    if (menu) menu.classList.add('open');
}

export function closeDropdown(dropdown) {
    const menu = dropdown.querySelector('.dropdown__menu');
    if (menu) menu.classList.remove('open');
}

export function closeAllDropdowns() {
    document.querySelectorAll('.dropdown__menu.open').forEach(menu => {
        menu.classList.remove('open');
    });
}
