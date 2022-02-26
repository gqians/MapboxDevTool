import setDevElement from './setDevElement';
import { mapConfig } from './map/map.config';
import Alpine from 'alpinejs';
import store from './store';
import Tagify from '@yaireo/tagify';
import '@yaireo/tagify/dist/tagify.css';
import PickleTree from './tree/pickletree';

export default class MapboxGLDebuggerControl {
	onAdd(map) {
		// console.log(document.getElementById('mapbox-gl-debugger'));
		this._container = document.createElement('div');
		this._container.id = 'mapbox-gl-debugger';
		this._container.innerHTML = setDevElement();
		// this._container = this._container.firstChild;
		// this._container.appendChild();
		this._map = map;
		window.mapboxMap = map;
		window.PickleTree = PickleTree;
		window.treeInstance = null;
		window.Tagify = Tagify;
		window.dragConfig = {
			active: false,
			currentX: 0,
			currentY: 0,
			initialX: 0,
			initialY: 0,
			xOffset: 0,
			yOffset: 0,
		};
		if (!window.Alpine) {
			window.Alpine = Alpine;
			// console.log(Alpine);
			document.addEventListener('alpine:init', () => {
				store();
			});
			window.Alpine.start();
		}
		map.on('load', () => {
			this._addTreeView();
		});
		return this._container;
	}

	onRemove() {
		this._container.parentNode.removeChild(this._container);
		this._map = undefined;
		window.mapboxMap = undefined;
		window.PickleTree = undefined;
		window.treeInstance = undefined;
		window.Alpine = undefined;
		window.dragConfig = undefined;
	}
	_addTreeView() {
		const mapChildren = window.Alpine.store('treeConfig').map.map((config, index) => {
			if (!window.mapboxMap[config.getMethod]) return null;
			return {
				// label: config.labelFormat(this._map[config.getMethod]()),
				// value: config.value,
				// selectable: config.selectable,

				n_id: config.value,
				n_title: config.labelFormat(this._map[config.getMethod]()),
				n_order_num: 0,
				n_parentid: 0,
				n_editable: true
			};
		}).filter(item => item);
		const instance = new PickleTree({
			c_target: 'div_tree',
			nodeEditCallback: (node, text) => {
				// console.log(node, text);
				const config = mapConfig.find(i => i.value === node.value);
				window.mapboxMap[config.setMethod](config.settingFormat(text));
			},
			c_config: {
				// start as folded or unfolded
				foldedStatus: false,
				// for logging
				logMode: false,
				// for switch element
				switchMode: false,
				// for automaticly select childs
				autoChild: true,
				// for automaticly select parents
				autoParent: true,
				// for drag / drop
				drag: false,
				// for ordering
				order: false,
			},
			c_data: mapChildren
		});
		window.treeInstance = instance;
		this._map.on('move', () => {
			mapConfig.forEach((config) => {
				if (!window.mapboxMap[config.getMethod]) return;
				window?.treeInstance?.getNode(config.value) && window.treeInstance.updateNodeTitle(window.treeInstance.getNode(config.value), config.labelFormat(window.mapboxMap[config.getMethod]()));
			});
		});
	}
}

