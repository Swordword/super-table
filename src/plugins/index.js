import SuperTableComponent from './SuperTable.vue'
export default {
	install(_Vue) {
		_Vue.component(SuperTableComponent.name,SuperTableComponent)
	},
}
