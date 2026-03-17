<template>
  <ContactSection
    :title="site.contact.title"
    :subtitle="site.contact.subtitle"
    :phone="site.contact.phone"
    :email="site.contact.email"
    :address="site.contact.address"
  />
</template>

<script setup lang="ts">
import ContactSection from '@/components/sections/ContactSection.vue'
import site from '@/data/site.json'
</script>
