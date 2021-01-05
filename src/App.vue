<template>
  <v-app>
    <v-main>
      <v-container>
        
      <settings-form />
      <stereogram />
      </v-container>
    </v-main>
  </v-app>
</template>

<script>
import Stereogram from './components/Stereogram';
import SettingsForm from './components/SettingsForm';

export default {
  name: 'App',

  components: {
    SettingsForm,
    Stereogram
  },

  data: () => ({
    //
  }),
};
</script>
