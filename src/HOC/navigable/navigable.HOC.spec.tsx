import * as React from 'react';
import { mount } from 'enzyme';
import { navigable } from 'HOC';
import { Provider } from 'react-redux';
import { store } from 'Reducers';

export class SampleComponent extends React.Component<any, {}> {
    public render() {
        return (<div className='container'>Hello World!</div>);
    }
}

const WrappedComponent = navigable(SampleComponent) as React.ComponentClass<INavigableProps>;

function setup() {
    const props: any = {
        parent,
        columns: 1,
        fakeProp: "",
    };
    const enzymeWrapper = mount(<Provider store={store} >
        <WrappedComponent
            {...props} />
    </Provider>);
    return {
        props,
        enzymeWrapper,
    };
}
const { enzymeWrapper, props } = setup();
describe("navigable.HOC", () => {
    it("should render self with info", () => {
        expect(enzymeWrapper.find(SampleComponent).length).toBeGreaterThan(0);
        const sampleProps = enzymeWrapper.find(SampleComponent).props();
        expect(sampleProps.columns).toBe(props.columns);
        expect(sampleProps.parent).toBe(props.parent);
        expect(sampleProps.idx).toBeGreaterThan(0);
    });

    it("it should passtrough the props to the HOCed children", () => {
        expect(enzymeWrapper.find(SampleComponent).length).toBeGreaterThan(0);
        const sampleProps = enzymeWrapper.find(SampleComponent).props();
        expect(sampleProps.fakeProp).toBeDefined();
    });
});
