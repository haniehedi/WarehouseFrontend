<template>
  <div class="warehouse-container">
    <h2>🏢 Warehouses</h2>
    <p>Select a warehouse to view its items!</p>

    <form @submit.prevent="addWarehouse" class="add-warehouse-form">
      <input type="text" v-model="newWarehouseName" required placeholder="New Warehouse Name" />
      <button type="submit" class="add-button">Add Warehouse</button>
    </form>

    <ul class="warehouse-list">
      <li
        v-for="warehouse in warehouses"
        :key="warehouse.id"
        class="warehouse-item"
      >
        <span @click="toggleWares(warehouse.id)">{{ warehouse.name }}</span>
        <button @click="openAddWareModal(warehouse.id)" class="add-ware-button">Add Ware</button>
      </li>
    </ul>

    <div v-if="selectedWarehouse" class="wares-section">
      <h3>📦 Items in {{ selectedWarehouse.name }}</h3>
      <ul class="ware-list">
        <li v-for="ware in selectedWarehouse.wares" :key="ware.id" class="ware-item">
          {{ ware.name }} - Cost Method: <strong>{{ ware.cost_method }}</strong>
        </li>
      </ul>
    </div>
    
    <div v-if="errorMessage" class="error-message">{{ errorMessage }}</div>

    <!-- Modal for adding ware -->
    <div v-if="isModalOpen" class="modal-overlay">
      <div class="modal-content">
        <h3>Add New Ware</h3>
        <form @submit.prevent="addWare">
          <input type="text" v-model="newWareName" required placeholder="Ware Name" />
          <input type="text" v-model="newWareCostMethod" required placeholder="Cost Method" />
          <input type="number" v-model="price" required placeholder="Price" />
          <input type="number" v-model="stock" required placeholder="Stock" />
          <input type="text" v-model="description" required placeholder="Description" />
         
          <button type="submit">Add Ware</button>
          <button type="button" @click="closeAddWareModal">Cancel</button>
        </form>
      </div>
    </div>
  </div>
</template>

<script>
import { mapGetters } from 'vuex';

export default {
  name: 'WarehousePage',
  data() {
    return {
      warehouses: [],
      selectedWarehouse: null,
      errorMessage: '',
      newWarehouseName: '',
      isModalOpen: false,
      newWareName: '',
      newWareCostMethod: '',
      currentWarehouseId: null,
      price: '',
      stock: '',
      description: '',
    };
  },
  computed: {
    ...mapGetters(['getToken', 'getUserId']),
  },
  async mounted() {
    await this.fetchWarehouses();
  },
  methods: {
    async fetchWarehouses() {
      try {
        const token = this.getToken;
        const warehouseResponse = await fetch('http://localhost:8000/warehouses/', {
          headers: {
            'Authorization': `Bearer ${token}`,
          },
        });

        if (!warehouseResponse.ok) {
          throw new Error(`Error ${warehouseResponse.status}: ${warehouseResponse.statusText}`);
        }

        this.warehouses = await warehouseResponse.json();
      } catch (error) {
        this.errorMessage = error.message;
        console.error('Error fetching data:', error);
      }
    },
    async addWarehouse() {
      const token = this.getToken;

      try {
        const response = await fetch('http://localhost:8000/warehouses/', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}`,
          },
          body: JSON.stringify({ name: this.newWarehouseName }),
        });

        if (!response.ok) {
          const errorData = await response.json();
          throw new Error(errorData.message || 'Failed to add warehouse');
        }

        this.newWarehouseName = '';
        await this.fetchWarehouses();
      } catch (error) {
        this.errorMessage = error.message;
      }
    },
    toggleWares(warehouseId) {
      const warehouse = this.warehouses.find(w => w.id === warehouseId);
      this.selectedWarehouse = this.selectedWarehouse === warehouse ? null : warehouse;
    },
    openAddWareModal(warehouseId) {
      this.currentWarehouseId = warehouseId;
      this.isModalOpen = true;
    },
    closeAddWareModal() {
      this.isModalOpen = false;
      this.newWareName = '';
      this.newWareCostMethod = '';
      this.price = '';
      this.stock = '';
      this.description = '';
    },
    async addWare() {
      const token = this.getToken;
      const userId = this.getUserId;

      try {
        const response = await fetch('http://localhost:8000/wares/', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}`,
          },
          body: JSON.stringify({
            name: this.newWareName,
            user_created: userId,
            warehouse: this.currentWarehouseId,
            cost_method: this.newWareCostMethod,
            price: parseFloat(this.price),
            stock: parseInt(this.stock, 10),
            description: this.description,
          }),
        });

        if (!response.ok) {
          const errorData = await response.json();
          throw new Error(errorData.message || 'Failed to add ware');
        }

        this.newWareName = '';
        this.newWareCostMethod = '';
        this.price = '';
        this.stock = '';
        this.description = '';
        this.closeAddWareModal();
        await this.fetchWarehouses(); 
      } catch (error) {
        this.errorMessage = error.message;
      }
    },
  },
};
</script>

<style scoped>
.warehouse-container {
  max-width: 600px;
  margin: auto;
  padding: 20px;
  border: 1px solid #ddd;
  border-radius: 8px;
  background-color: #f9f9f9;
  font-family: Arial, sans-serif;
}

.add-warehouse-form {
  margin-bottom: 20px;
  display: flex; /* Align items horizontally */
}

.add-warehouse-form input {
  padding: 10px;
  border: 1px solid #ccc;
  border-radius: 4px;
  flex: 1; /* Take up remaining space */
}

.add-button {
  padding: 10px;
  background-color: #007bff;
  color: white;
  border: none;
  border-radius: 4px;
  margin-left: 10px; /* Space between input and button */
  cursor: pointer;
}

.warehouse-list {
  list-style-type: none;
  padding: 0;
}

.warehouse-item {
  display: flex; /* Align items horizontally */
  justify-content: space-between; /* Space between name and button */
  padding: 10px;
  border-bottom: 1px solid #ccc;
  transition: background-color 0.3s;
}

.warehouse-item:hover {
  background-color: #e0f7fa;
}

.add-ware-button {
  padding: 5px 10px;
  border: 1px solid #ccc; 
  background-color: transparent;
  cursor: pointer;
}

.ware-list {
  list-style-type: none;
  padding: 0;
}

.ware-item {
  margin-left: 20px;
}

.error-message {
  color: red;
  margin-top: 20px;
}

.modal-overlay {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background-color: rgba(0, 0, 0, 0.5);
  display: flex;
  justify-content: center;
  align-items: center;
  z-index: 1000;
}

.modal-content {
  background: white;
  padding: 20px;
  border-radius: 8px;
  box-shadow: 0 2px 10px rgba(0, 0, 0, 0.1);
  width: 300px;
}

.modal-content input {
  margin-bottom: 10px;
}
</style>
