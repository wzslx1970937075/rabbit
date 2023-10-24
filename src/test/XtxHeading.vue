<script lang="ts" setup>
import { h, useSlots } from "vue";
const props = defineProps<{ level: 1 | 2 | 3 | 4 | 5 | 6 }>();
const slots = useSlots();

function render() {
  return h(`h${props.level}`, slots.default?.());
}
</script>

<template>
  <render />
</template>
