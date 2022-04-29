
Component serialization is part of the component definition. As we saw in the previous
section, the serialization indicates how the component will be packed and will navigate by the different
transports that can exist. The most common pipe is the communication between the scene and the renderer.
The renderer creates the representation in the 3D world interpreting each data of each component (and each entity).

## Component defined by the Engine
The core engine of the ECS has the basic and variety of tools to make amazing things.
These components need to be maintainable over time, and always keep both backward and
forward compatibility. One scenario: 
1. Assuming that the renderer has the latest version of 
the components, the scene **(A)** with ECS 7.0.0 and scene **(B)** with ECS 7.3.1 
2. In scene **(B)** there is no problem.
3. With scene **(A)**, the renderer has to be able to parse old components and send old components.

The definition itself of the core components is using Protocol Buffer and they are in 
src/component/definitions. The PB serialization is a powerful tool to work with these compatibility topics.

- Making a new component is just adding the .proto file.
- Modifying a component is just modifying it and let sure that the pipeline pass, which indicates that you are keeping the compatibility.

### The special component
We have a special treat with the Transform component. It contains the position, scale, and
rotation of an Entity and it's often changing. Using protocol buffer here might be overkill
since components definition never change and the values can be copied 1-1 in memory.
The definition of this component is in src/components/definitions/Transform.md

## Component defined by the Creator

The creators can define their own components, no matters how complex they are. But, 
the maintainability lies with them. The options are limited only by the imagination, although we can suggest use built-in-types.  

### Built-in-types (WIP)

This maps directly with the EcsType used in the ECS 7.

Defines the flow and how to serialize:
- **MapType**
- **ArrayType**
- **Optional**
- **Enum**

Define the primitive data to serialize:
- Int8
- Int16
- Int32
- Int64
- Float32
- Float64
- Boolean
- String
- Enum