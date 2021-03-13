<template>
  <v-app>
    <v-main>
      <v-container fluid>
        <v-row justify="center">
          <v-col cols="10">
            <settings-form v-model="settings" />
            <stereogram :settings="settings" />
          </v-col>
        </v-row>
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
    settings: {}
  }),
};
</script>
<style lang="scss">
.fill-width {
  width: 100% !important;
}
</style>