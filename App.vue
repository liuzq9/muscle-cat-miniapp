<script setup lang="ts">
// App-level lifecycle is intentionally small; authentication can be added here later.
</script>

<style lang="scss">
@use './styles/global.scss';

page {
  background: $page-bg;
  color: $ink;
  font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif;
}

view,
text,
button,
input {
  box-sizing: border-box;
}

button {
  margin: 0;
}
</style>
