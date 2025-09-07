<template>
  <q-page class="q-pa-md flex column">
    <!-- Área principal con resultado -->
    <div class="row q-gutter-md" style="flex: 1; min-height: 0">
      <!-- Panel lateral de controles -->
      <q-card class="col-3 q-pa-sm flex column" style="max-width: 350px; overflow-y: auto">
        <q-card-section>
          <div class="text-h6">Configuración</div>
        </q-card-section>

        <!-- Tipo de fondo -->
        <q-separator />
        <q-card-section>
          <div class="text-subtitle2">Fondo</div>
          <q-option-group
            v-model="backgroundType"
            :options="[
              { label: 'Patrón de puntos', value: 'pattern' },
              { label: 'Imagen', value: 'image' },
            ]"
            type="radio"
          />
          <div v-if="backgroundType === 'image'" class="q-mt-sm">
            <q-file
              filled
              bottom-slots
              v-model="backgroundImage"
              label="Subir imagen"
              accept="image/*"
              @update:model-value="previewBackground"
            >
              <template v-slot:append>
                <q-icon name="image" />
              </template>
            </q-file>
            <q-img
              v-if="backgroundPreview"
              :src="backgroundPreview"
              ratio="16/9"
              class="q-mt-sm rounded-borders"
            />
          </div>
        </q-card-section>

        <!-- Modelo -->
        <q-separator />
        <q-card-section>
          <div class="text-subtitle2">Modelo</div>
          <q-option-group
            v-model="modelType"
            :options="[
              { label: 'Imagen con depthmap', value: 'depthmap' },
              { label: 'Archivo 3D (stl/obj)', value: '3d' },
            ]"
            type="radio"
          />
          <div v-if="modelType === 'depthmap'" class="q-mt-sm">
            <q-file
              filled
              v-model="depthmapFile"
              label="Subir depthmap"
              accept="image/*"
              @update:model-value="previewDepthmap"
            />
            <q-img
              v-if="depthmapPreview"
              :src="depthmapPreview"
              ratio="16/9"
              class="q-mt-sm rounded-borders"
            />
          </div>
          <div v-else-if="modelType === '3d'" class="q-mt-sm">
            <q-file
              filled
              v-model="object3DFile"
              label="Subir 3D (STL/OBJ)"
              accept=".stl,.obj"
              @update:model-value="preview3D"
            />
            <q-img
              v-if="object3DPreview"
              :src="object3DPreview"
              ratio="16/9"
              class="q-mt-sm rounded-borders"
            />
          </div>
        </q-card-section>

        <!-- Ajustes -->
        <q-separator />
        <q-card-section>
          <div class="text-subtitle2">Ajustes</div>
          <q-select
            v-model="stereoType"
            :options="[
              { label: 'Cross-eyed', value: 'cross' },
              { label: 'Wall-eyed', value: 'wall' },
            ]"
            label="Modo de visión"
          />

          <q-slider v-model="patternSeparation" :min="5" :max="100" label class="q-mt-md">
            <template v-slot:label>Separación patrón: {{ patternSeparation }}</template>
          </q-slider>

          <q-slider v-model="depthMultiplier" :min="0.1" :max="5" step="0.1" label class="q-mt-md">
            <template v-slot:label>Profundidad × {{ depthMultiplier }}</template>
          </q-slider>

          <q-select
            v-model="filters"
            multiple
            :options="[
              { label: 'Blur', value: 'blur' },
              { label: 'Sharpen', value: 'sharpen' },
              { label: 'Invertir depthmap', value: 'invert' },
            ]"
            label="Filtros"
            class="q-mt-md"
          />
        </q-card-section>

        <q-separator />
        <q-card-actions align="right">
          <q-btn label="Generar" color="primary" @click="generateStereogram" />
        </q-card-actions>
      </q-card>

      <!-- Área de resultado -->
      <q-card class="col flex flex-center bg-grey-10 text-white">
        <q-card-section class="full-width flex flex-center" style="overflow: auto">
          <q-img
            v-if="resultImage"
            :src="resultImage"
            fit="contain"
            style="max-height: 100%; max-width: 100%"
          />
          <div v-else class="text-grey-5">Aquí aparecerá el estereograma generado</div>
        </q-card-section>
      </q-card>
    </div>
  </q-page>
</template>

<script setup>
import { ref } from 'vue'

const backgroundType = ref('pattern')
const backgroundImage = ref(null)
const backgroundPreview = ref(null)

const modelType = ref('depthmap')
const depthmapFile = ref(null)
const depthmapPreview = ref(null)
const object3DFile = ref(null)
const object3DPreview = ref(null)

const stereoType = ref('cross')
const patternSeparation = ref(20)
const depthMultiplier = ref(1.0)
const filters = ref([])

const resultImage = ref(null)

function previewBackground(file) {
  if (file) backgroundPreview.value = URL.createObjectURL(file)
}

function previewDepthmap(file) {
  if (file) depthmapPreview.value = URL.createObjectURL(file)
}

function preview3D(file) {
  if (file) {
    // Aquí en un proyecto real podrías renderizar el objeto 3D y generar preview como imagen
    object3DPreview.value = '/placeholder-3d-preview.png'
  }
}

function generateStereogram() {
  // Aquí deberías llamar a tu lógica real de generación de estereogramas
  // Por ahora solo pongo un placeholder
  resultImage.value = 'https://placehold.co/800x600?text=Stereogram+Generado'
}
</script>
