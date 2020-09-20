import React from "react";
import {Container, Sprite, Graphics } from '@inlet/react-pixi'
import playerSoldier from '../players/soldier01.png'

const Circle = () => (
  <Graphics
    draw = {g => {
        g.lineStyle(0)
        g.beginFill(0xa92a52)
        g.drawCircle(170, 90, 30)
        g.endFill()
    }
    }
  />
)

const Rectangle = () => (
  <Container position={[400, 300]}>
    <Sprite
      anchor={0.5}
      x={75}
      y={75}
      image={playerSoldier}
    />
    <Circle />
  </Container>
)
export default Rectangle;