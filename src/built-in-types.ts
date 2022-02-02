
export const Integer = Number
export const BigInteger = Number
export const Float = Number

export const Vector2 = {
  'x': Float,
  'y': Float
}
export const Vector3 = {
  'x': Float,
  'y': Float,
  'z': Float
}
export const Quaternion = {
  'x': Float,
  'y': Float,
  'z': Float,
  'w': Float
}

export const createVector3 = (x: number, y: number, z: number) => ({ x, y, z })

export const AllAcceptedTypes = [
  BigInteger, Integer, Float, String, Vector2, Vector3, Quaternion
]