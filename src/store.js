import { mapConfig } from './map/map.config';

const store = () => {
	window.Alpine.store('clickItem', {
		type: '',
		value: '',
		setType(label) { this.type = label.split(' -- ')[0]; },
		setValue(label) { this.value = label.split(' -- ')[1]; },
	});
	// window.Alpine.store('treeInstance', {
	// 	value: null,
	// 	setValue(instance) { this.value = instance; },
	// });
	window.Alpine.store('treeConfig', {
		map: mapConfig,
	});
};
export default store;
