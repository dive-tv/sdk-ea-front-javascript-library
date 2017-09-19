import * as React from 'react';
import { shallow } from 'enzyme';
import { UIActions } from 'Actions';
import { LayoutClass } from './layout.container';
import { initialUIState } from 'Reducers';

function setup(propArgs?: any) {
    /*const props = {
      divider: 80,
    };*/
    let props;
    if (propArgs) {
        props = propArgs;
    } else {
        props = { ...UIActions, ui: initialUIState };
    }

    const enzymeWrapper = shallow(<LayoutClass {...props} />);

    return {
        props,
        enzymeWrapper,
    };
}

describe("layout.container", () => {
    it("should render self and subcomponents", () => {
        const { enzymeWrapper } = setup();
        expect(enzymeWrapper.instance() instanceof LayoutClass).toBe(true);
        const container = enzymeWrapper.find(".containerLayout");
        expect(enzymeWrapper.is(".containerLayout")).toBe(true);
        expect(container.length).toBe(1);
        expect(container.children().length).toBe(2);
        expect(container.find(".layoutTop").length).toBe(1);
        expect(container.find(".layoutBottom").length).toBe(1);
    });

    it("should assign the divider value to the top container's height", () => {
        const { enzymeWrapper, props } = setup();
        const topContainer = enzymeWrapper.find(".layoutTop");
        const style = topContainer.first().props().style || { height: undefined };
        expect(style.height).toBe(`${props.ui.divider}%`);
    });

    it("should assign the 100% - divider value to the bottom container's height", () => {
        const { enzymeWrapper, props } = setup();
        const bottomContainer = enzymeWrapper.find(".layoutBottom");
        const style = bottomContainer.first().props().style || { height: undefined };
        expect(style.height).toBe(`${100 - props.ui.divider}%`);
    });
});
