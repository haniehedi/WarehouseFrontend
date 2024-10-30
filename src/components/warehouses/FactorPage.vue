<template>
  <div class="factor-container">
    <h2>📊 Factors</h2>
    
    <form @submit.prevent="addFactor" class="add-factor-form">
      <select v-model="selectedWare" required>
        <option disabled value="">Select Ware</option>
        <option v-for="ware in wares" :key="ware.id" :value="ware.id">{{ ware.name }}</option>
      </select>
      <input type="number" v-model="quantity" required placeholder="Quantity" />
      <input type="number" v-model="purchasePrice" required placeholder="Purchase Price" />
      <select v-model="type" required>
        <option disabled value="">Select Type</option>
        <option value="input">Input</option>
        <option value="output">Output</option>
      </select>
      <button type="submit" class="add-button">Add Factor</button>
    </form>

    <ul class="factor-list">
      <li v-for="factor in factors" :key="factor.id" class="factor-item">
        <span>{{ getWareName(factor.ware) }} - {{ factor.type }} - Quantity: {{ factor.quantity }} - Price: {{ factor.purchase_price }}</span>
        <button @click="openEditFactorModal(factor)" class="edit-button">Edit</button>
        <button @click="deleteFactor(factor.id)" class="delete-button">Delete</button>
      </li>
    </ul>

    <!-- Modal for editing factor -->
    <div v-if="isEditModalOpen" class="modal-overlay">
      <div class="modal-content">
        <h3>Edit Factor</h3>
        <form @submit.prevent="updateFactor">
          <select v-model="editFactor.ware" required>
            <option disabled value="">Select Ware</option>
            <option v-for="ware in wares" :key="ware.id" :value="ware.id">{{ ware.name }}</option>
          </select>
          <input type="number" v-model="editFactor.quantity" required placeholder="Quantity" />
          <input type="number" v-model="editFactor.purchase_price" required placeholder="Purchase Price" />
          <select v-model="editFactor.type" required>
            <option value="input">Input</option>
            <option value="output">Output</option>
          </select>
          <button type="submit">Update Factor</button>
          <button type="button" @click="closeEditFactorModal">Cancel</button>
        </form>
      </div>
    </div>
    
    <div v-if="errorMessage" class="error-message">{{ errorMessage }}</div>
  </div>
</template>

<script>
import { mapGetters } from 'vuex';

export default {
  name: 'FactorComponent',
  data() {
    return {
      factors: [],
      wares: [],
      selectedWare: '',
      quantity: '',
      purchasePrice: '',
      type: '',
      isEditModalOpen: false,
      editFactor: {},
      errorMessage: '',
    };
  },
  computed: {
    ...mapGetters(['getToken']),
  },
  async mounted() {
    await this.fetchFactors();
    await this.fetchWares();
  },
  methods: {
    async fetchFactors() {
      const token = this.getToken;
      try {
        const response = await fetch('http://localhost:8000/factors/', {
          headers: { 'Authorization': `Bearer ${token}` },
        });
        if (!response.ok) throw new Error('Failed to fetch factors');
        this.factors = await response.json();
      } catch (error) {
        this.errorMessage = error.message;
      }
    },
    async fetchWares() {
      const token = this.getToken;
      try {
        const response = await fetch('http://localhost:8000/wares/', {
          headers: { 'Authorization': `Bearer ${token}` },
        });
        if (!response.ok) throw new Error('Failed to fetch wares');
        this.wares = await response.json();
      } catch (error) {
        this.errorMessage = error.message;
      }
    },
    getWareName(wareId) {
      const ware = this.wares.find(w => w.id === wareId);
      return ware ? ware.name : 'Unknown Ware';
    },
    async addFactor() {
      const token = this.getToken;
      try {
        const response = await fetch('http://localhost:8000/factors/', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}`,
          },
          body: JSON.stringify({
            user: this.$store.state.userId, 
            ware: this.selectedWare,
            quantity: this.quantity,
            purchase_price: this.purchasePrice,
            type: this.type,
          }),
        });
        if (!response.ok) throw new Error('Failed to add factor');
        await this.fetchFactors();
        this.resetForm();
      } catch (error) {
        this.errorMessage = error.message;
      }
    },
    openEditFactorModal(factor) {
      this.editFactor = { ...factor };
      this.isEditModalOpen = true;
    },
    async updateFactor() {
      const token = this.getToken;
      try {
        const response = await fetch(`http://localhost:8000/factors/${this.editFactor.id}/`, {
          method: 'PUT',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}`,
          },
          body: JSON.stringify(this.editFactor),
        });
        if (!response.ok) throw new Error('Failed to update factor');
        await this.fetchFactors();
        this.closeEditFactorModal();
      } catch (error) {
        this.errorMessage = error.message;
      }
    },
    async deleteFactor(id) {
      const token = this.getToken;
      try {
        const response = await fetch(`http://localhost:8000/factors/${id}/`, {
          method: 'DELETE',
          headers: { 'Authorization': `Bearer ${token}` },
        });
        if (!response.ok) throw new Error('Failed to delete factor');
        await this.fetchFactors();
      } catch (error) {
        this.errorMessage = error.message;
      }
    },
    closeEditFactorModal() {
      this.isEditModalOpen = false;
      this.editFactor = {};
    },
    resetForm() {
      this.selectedWare = '';
      this.quantity = '';
      this.purchasePrice = '';
      this.type = '';
    },
  },
};
</script>

<style scoped>
.factor-container {
  max-width: 600px;
  margin: auto;
  padding: 20px;
  border: 1px solid #ddd;
  border-radius: 8px;
  background-color: #f9f9f9;
  font-family: Arial, sans-serif;
}

.add-factor-form {
  margin-bottom: 20px;
  display: flex;
  flex-direction: column;
}

.add-factor-form input,
.add-factor-form select {
  padding: 10px;
  margin-bottom: 10px;
  border: 1px solid #ccc;
  border-radius: 4px;
}

.add-button {
  padding: 10px;
  background-color: #007bff;
  color: white;
  border: none;
  border-radius: 4px;
  cursor: pointer;
}

.factor-list {
  list-style-type: none;
  padding: 0;
}

.factor-item {
  display: flex;
  justify-content: space-between;
  padding: 10px;
  border-bottom: 1px solid #ccc;
}

.edit-button,
.delete-button {
  padding: 5px;
  background-color: transparent;
  border: none;
  cursor: pointer;
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

.error-message {
  color: red;
  margin-top: 20px;
}
</style>
