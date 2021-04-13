function createParallax (scene, totalWidth, texture, scrollFactor) {
    const w = scene.textures.get(texture).getSourceImage().width
    const count = Math.ceil(totalWidth / w) * scrollFactor

    let x = 0
    for (let i = 0; i < count; ++i)
    {
        let m = scene.add.image(x, scene.scale.height, texture)
            .setOrigin(0, 1)
            .setScrollFactor(scrollFactor, 0)

        x += m.width
        m.depth = -1
    }
}