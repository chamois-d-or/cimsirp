import { components as ecommerceComponents } from '../slices/ecommerce/index'
import { components as marketingComponents } from '../slices/marketing/index'

const __allComponents = {  ...ecommerceComponents, ...marketingComponents }

import state from "../.slicemachine/libraries-state.json";

const SliceListPage = () => {
  const ecommerceSlices = Object.values(state["slices/ecommerce"].components).map(slice => Object.values(slice.mocks)).flat()
  const marketingSlices = Object.values(state["slices/marketing"].components).map(slice => Object.values(slice.mocks)).flat()
  const __allSlices = [...ecommerceSlices, ...marketingSlices]
  const renderedSlices = __allSlices.map((slice, index) => {
      const type = "slice_type" in slice ? slice.slice_type : slice.type;

      let Comp =
      __allComponents[type] || defaultComponent;

      const key =
        "id" in slice && slice.id
          ? slice.id
          : `${index}-${JSON.stringify(slice)}`;

      return (
        <div className="p-20" key={key}>
          <h3 className="mb-5 text-center text-2xl rounded-md">Slice: {slice.slice_type}</h3>
          <h3 className="mb-5 text-center text-xl rounded-md">Variation: {slice.variation}</h3>
          <div className="isolate bg-white rounded-md">
            <Comp
              slice={slice}
              index={index}
              slices={__allSlices}
            />
          </div>
        </div>
      );
    })
  return (
      <div>
        <>{renderedSlices}</>
      </div>
  );
};

export default SliceListPage;