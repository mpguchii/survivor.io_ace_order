const materials = {
    'crystal_stone': { 'material_per_ticket': 3, 'gem_per_material': 26.66666667, 'image': 'materials/crystal_stone.png' },
    'energy_core': { 'material_per_ticket': 0.5, 'gem_per_material': 160, 'image': 'materials/energy_core.png' },
    'food_crate': { 'material_per_ticket': 4, 'gem_per_material': 20, 'image': 'materials/food_crate.png' },
    'integrated_chip': { 'material_per_ticket': 1, 'gem_per_material': 80, 'image': 'materials/integrated_chip.png' },
    'identity_card': { 'material_per_ticket': 3, 'gem_per_material': 26.66666667, 'image': 'materials/identity_card.png' },
    'iron': { 'material_per_ticket': 4, 'gem_per_material': 20, 'image': 'materials/iron.png' },
    'medical_crate': { 'material_per_ticket': 12, 'gem_per_material': 6.666666667, 'image': 'materials/medical_crate.png' },
    'precision_equipment': { 'material_per_ticket': 6, 'gem_per_material': 13.33333333, 'image': 'materials/precision_equipment.png' },
    'steel': { 'material_per_ticket': 12, 'gem_per_material': 6.666666667, 'image': 'materials/steel.png' },
    'weapons_crate': { 'material_per_ticket': 6, 'gem_per_material': 13.33333333, 'image': 'materials/weapons_crate.png' },
    'wood': { 'material_per_ticket': 12, 'gem_per_material': 6.666666667, 'image': 'materials/wood.png' },
};

const rewards = {
    'awaken_box': { 'gem_cost': 15000, 'ticket_value': 187.5, 'image': 'materials/awaken_box.png' },
    'awaken_core': { 'gem_cost': 6000, 'ticket_value': 75, 'image': 'materials/awaken_core.png' },
    'collection': { 'gem_cost': 3000, 'ticket_value': 37.5, 'image': 'materials/collection.png' },
    'collection_randon': { 'gem_cost': 1500, 'ticket_value': 18.75, 'image': 'materials/collection_randon.png' },
    'diamond': { 'gem_cost': 1, 'ticket_value': 0.0125, 'image': 'materials/diamond.png' },
    'mettalia': { 'gem_cost': 500, 'ticket_value': 6.25, 'image': 'materials/mettalia.png' },
    'resonance_box': { 'gem_cost': 15000, 'ticket_value': 187.5, 'image': 'materials/resonance_box.png' },
    'resonance_chip': { 'gem_cost': 10000, 'ticket_value': 125, 'image': 'materials/resonance_chip.png' },
    'SSstone': { 'gem_cost': 15000, 'ticket_value': 187.5, 'image': 'materials/SSstone.png' },
    'Sstone_box': { 'gem_cost': 15000, 'ticket_value': 187.5, 'image': 'materials/Sstone_box.png' },
    'Ssuplykey': { 'gem_cost': 200, 'ticket_value': 2.5, 'image': 'materials/Ssuplykey.png' },
    'Ssupply': { 'gem_cost': 6000, 'ticket_value': 75, 'image': 'materials/Ssupply.png' },
    'Ssuuply_randon': { 'gem_cost': 2500, 'ticket_value': 31.25, 'image': 'materials/Ssuuply_randon.png' },
    'tech_part': { 'gem_cost': 5000, 'ticket_value': 62.5, 'image': 'materials/tech_part.png' },
    'token': { 'gem_cost': 2.5, 'ticket_value': 0.03125, 'image': 'materials/token.png' },
    'ticket': { 'gem_cost': 80, 'ticket_value': 1, 'image': 'materials/ticket.png' },
    'tech_randon': { 'gem_cost': 2000, 'ticket_value': 25, 'image': 'materials/tech_randon.png' },
};
const initialReward = 'token';
const orderContainer = document.getElementById('order-container');
const rewardsContainer = document.getElementById('rewards-container');
const orderTotalEl = document.getElementById('order-total');
const rewardTotalEl = document.getElementById('reward-total');
const profitEl = document.getElementById('profit');
const popup = document.getElementById('popup');
const popupItemsContainer = document.getElementById('popup-items');
let currentType = '';

// Start with the token in the rewards
window.addEventListener('load', () => {
    addItem('reward', initialReward);
});

document.getElementById('add-order').addEventListener('click', () => {
    openPopup('order');
});

document.getElementById('add-reward').addEventListener('click', () => {
    openPopup('reward');
});

document.getElementById('close-popup').addEventListener('click', () => {
    popup.style.display = 'none';
});

function openPopup(type) {
    currentType = type;
    popupItemsContainer.innerHTML = '';

    const items = type == "order" ? { ...materials } : { ...materials, ...rewards };
    for (const key in items) {
        const itemDiv = document.createElement('div');
        itemDiv.classList.add('popup-item');
        itemDiv.dataset.type = key;
        itemDiv.innerHTML = `<img src="${items[key].image}" alt="${key}"><span>${key.replace(/_/g, ' ')}</span>`;
        itemDiv.addEventListener('click', () => selectItem(key));
        popupItemsContainer.appendChild(itemDiv);
    }

    popup.style.display = 'flex';
}

function selectItem(itemKey) {
    addItem(currentType, itemKey);
    popup.style.display = 'none';
}

function addItem(type, itemKey) {
    const items = type === 'order' ? { ...materials } : { ...materials, ...rewards };
    const itemContainer = type === 'order' ? orderContainer : rewardsContainer;

    const itemDiv = document.createElement('div');
    itemDiv.classList.add(`${type}-item`);
    itemDiv.innerHTML = `
        <img src="${items[itemKey].image}" alt="${itemKey}">
        <span>${itemKey.replace(/_/g, ' ')}</span>
        <input type="number" onchange="calculateTotals()" value="1" min="1" data-type="${itemKey}">
        <button class="remove-item">X</button>
    `;
    itemDiv.querySelector('.remove-item').addEventListener('click', () => removeItem(itemDiv, type));

    itemContainer.appendChild(itemDiv);
    calculateTotals();
}

function removeItem(itemDiv, type) {
    itemDiv.remove();
    calculateTotals();
}

function calculateTotals() {
    let orderTotalGems = 0, orderTotalTickets = 0;
    let rewardTotalGems = 0, rewardTotalTickets = 0;

    document.querySelectorAll('.order-item').forEach(item => {
        const material = item.querySelector('input').dataset.type;
        const quantity = parseInt(item.querySelector('input').value);
        const cost = materials[material];

        orderTotalGems += cost.gem_per_material * quantity;
        orderTotalTickets += quantity / cost.material_per_ticket;
    });

    document.querySelectorAll('.reward-item').forEach(item => {
        const reward = item.querySelector('input').dataset.type;
        const quantity = parseInt(item.querySelector('input').value);
        let cost = rewards[reward];

        if (!cost) {
            cost = materials[reward];
        }
        if (cost.gem_cost)
            rewardTotalGems += cost.gem_cost * quantity;
        else
            rewardTotalGems += cost.gem_per_material * quantity;

        if (cost.ticket_value)
            rewardTotalTickets += cost.ticket_value * quantity;
        else
            rewardTotalTickets += 80 / (cost.gem_per_material * quantity);

    });

    orderTotalEl.textContent = `${orderTotalGems.toFixed(2)} Gems / ${orderTotalTickets.toFixed(2)} Tickets`;
    rewardTotalEl.textContent = `${rewardTotalGems.toFixed(2)} Gems / ${rewardTotalTickets.toFixed(2)} Tickets`;
    const profitGems = rewardTotalGems - orderTotalGems;
    const profitTickets = rewardTotalTickets - orderTotalTickets;
    profitEl.textContent = `${profitGems.toFixed(2)} Gems / ${profitTickets.toFixed(2)} Tickets`;
}