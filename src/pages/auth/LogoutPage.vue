<template>
  <div class="logout-container">
    <div class="logout-content">
      <div class="spinner"></div>
      <p class="logout-text">Logging out...</p>
    </div>
  </div>
</template>

<script>
import MethodsMixin from 'src/mixins/MethodsMixin'

export default {
  name: "LogoutPage",
  mixins: [MethodsMixin],
  mounted() {
    this.$nextTick(() => {
      this.performLogout()
    })
  },
  methods: {
    performLogout() {
      this.$store.dispatch("auth/logout", null, { root: true })
        .then(() => {
          this.goTo("/login")
        })
        .catch(error => {
          console.error('Logout failed:', error)
          // Optional: Show error notification
          this.goTo("/login") // Still redirect even if logout fails
        })
    }
  }
}
</script>

<style lang="scss" scoped>
.logout-container {
  display: flex;
  justify-content: center;
  align-items: center;
  height: 100vh;
  background-color: #f0f2f5;
}

.logout-content {
  text-align: center;
}

.spinner {
  border: 4px solid #f3f3f3;
  border-top: 4px solid #3498db;
  border-radius: 50%;
  width: 50px;
  height: 50px;
  animation: spin 1s linear infinite;
  margin: 0 auto 20px;
}

.logout-text {
  color: #333;
  font-size: 18px;
}

@keyframes spin {
  0% { transform: rotate(0deg); }
  100% { transform: rotate(360deg); }
}
</style>
