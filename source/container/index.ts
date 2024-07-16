import { ContainerInterface } from "./interface";
import { AccordionInterface } from "../components/accordion/interface";

/**
 * @name         Container - SUI
 * @description  <b>Container</b> - Next generation user and application interface kit for developers.
 * @version      v1.0.0
 * @author       Selçuk Çukur <hk@selcukcukur.com.tr>
 * @license      The MIT License (https://docs.srylius.com/ui/license)
 * @copyright    (C) 2010 - 2024 Srylius (Srylius Teknoloji Limited Şirketi)
 **/
class Container implements ContainerInterface {
    /** @inheritdoc */
    _instances: {
        Accordion: { [id: string]: AccordionInterface };
    };

    /**
     * Create a new container instance.
     *
     * @constructor
     */
    constructor() {
        // Set all component instances to empty.
        this._instances = {
            Accordion : {}
        };
    }

    /** @inheritdoc */
    add(component: keyof Container['_instances'], instance: any, id?: string, override: boolean = false): any {
        // Check if the component is available.
        if (!this._instances[component]) {
            // Notify the user of the transaction result.
            warningLog(`Component ${component} does not exist.`);

            // If the component is not found, return false.
            return false;
        }

        //  Check if any components have been registered with such a unique ID before.
        if (this._instances[component][id] && !override) {
            // Notify the user of the transaction result.
            warningLog(`Instance with ID ${id} already exists.`);

            // Return false if overwriting is disabled and the component is not found.
            return;
        }

        // Check if it has been declared to be overridden.
        if (override && this._instances[component][id]) {
            // Delete the instance as invalidation is desired.
            this._instances[component][id].destroyAndRemove();
        }

        // If a unique ID is not provided, create and add a new unique ID.
        this._instances[component][id ? id : this._generateRandomId()] = instance;
    }

    /** @inheritdoc */
    get(component: keyof Container['_instances'], id: string): any {
        // Component and check if there is a component with a unique identifier.
        if (!this._componentAndInstanceCheck(component, id)) {
            return;
        }

        // If there is an existing instance with the given unique identifier, get it.
        return this._instances[component][id] as any;
    }

    /** @inheritdoc */
    set(component: keyof Container['_instances'], instance: any, id: string): boolean | void {
        // Component and check if there is a component with a unique identifier.
        if (!this._componentAndInstanceCheck(component, id)) {
            return;
        }

        // If there is an existing instance with the given unique identifier, get it.
        this._instances[component][id] = instance;
    }

    /** @inheritdoc */
    has(component: keyof Container['_instances'], id: string): boolean | void {
        // Check if the ingredients are present in the instance.
        if (!this._instances[component]) {
            return false;
        }

        // Check if a component exists with the specified identifier.
        if (!this._instances[component][id]) {
            return false;
        }

        // If it passes both checks, it is present.
        return true;
    }

    /** @inheritdoc */
    remove(component: keyof Container['_instances'], id: string): boolean | void {
        // Component and check if there is a component with a unique identifier.
        if (!this._componentAndInstanceCheck(component, id)) {
            return;
        }

        // Remove the specified component.
        delete this._instances[component][id];
    }

    /** @inheritdoc */
    destroy(component: keyof Container['_instances'], id: string): boolean | void {
        // Component and check if there is a component with a unique identifier.
        if (!this._componentAndInstanceCheck(component, id)) {
            return;
        }

        // Destroy the specified component.
        this._instances[component][id].destroy();
    }

    /** @inheritdoc */
    destroyAndRemove(component: keyof Container['_instances'], id: string): boolean | void {
        // Component and check if there is a component with a unique identifier.
        if (!this._componentAndInstanceCheck(component, id)) {
            return;
        }

        // Destroy the given component instance from the container.
        this.destroy(component, id);

        // Remove the given component instance from the container.
        this.remove(component, id);
    }

    /** @inheritDoc */
    all(): any {
        // Return all existing instances.
        return this._instances;
    }

    /**
     * Generate a unique random id.
     *
     * @return {string}
     */
    private _generateRandomId(): string {
        // Generate a unique random ID.
        return Math.random().toString(36).substring(2, 9);
    }

    /**
     * Component and check if there is a component with a unique identifier.
     *
     * @param {Container['_instances']} component
     * @param {string} id
     *
     * @return {boolean}
     */
    private _componentAndInstanceCheck(component: keyof Container['_instances'], id: string): boolean {
        // Check if the ingredients are present in the instance.
        if (!this._instances[component]) {
            // Notify the user of the transaction result.
            warningLog(`Component ${component} does not exist.`);

            // Return false because the component does not exist.
            return false;
        }

        // Check if a component exists with the specified identifier.
        if (!this._instances[component][id]) {
            // Notify the user of the transaction result.
            warningLog(`Instance with ID ${id} does not exist.`);

            // Return false because the instance does not exist.
            return false;
        }

        // Return true if the component and instance exist.
        return true;
    }
}

/**
 * <b>Container</b> - Next generation user and application interface kit for developers.
 *
 * @type {Container}
 */
const SuiContainer: Container = new Container();

// Export
export default SuiContainer;

// Check if there is a window containing the DOM document.
if (typeof window !== 'undefined') {
    // Identify the "Container" component.
    window.SuiContainer = SuiContainer;
}