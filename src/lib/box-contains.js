export default function contains(point, box) {
  return point.x >= box.left
    && point.y >= box.top
    && point.x < box.right
    && point.y < box.bottom
}
