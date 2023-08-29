<template>
  <div>
    <table class="border">
      <th></th>
      <th v-for="date in get7dates(today)" class="border">
        <p>{{ date.getDate() }}</p>
        <p>{{ getDayName(date, locale) }}</p>
      </th>
      <tr v-for="hour in hours" class="border">
        <td class="border">{{ hour }}:00</td>
        <td v-for="date in get7dates(today)" class="border"></td>
      </tr>
    </table>
  </div>
</template>

<script setup lang="ts">
  const {locale} = useI18n()
  const hours = [9,10,11,12,13,14,15,16,17]
  let today = new Date()

  
  function get7dates (startDate) {
    const date = startDate.getDate()
    const month = startDate.getMonth()
    const year = startDate.getFullYear()
    const dateList = []

    for (let i = 0; i < 7; i++) {
      const newDate = new Date (year, month, date + i)
      dateList.push(newDate)    
   }
   return dateList
  }

  function getDayName (date, locale) {
    return date.toLocaleDateString(locale, { weekday: 'long' });    
  }

  // const bookings = getBookings();
  // console.log(bookings);
</script>

<style scoped>

</style>