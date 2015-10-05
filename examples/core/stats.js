import Stats from 'stats.js'

const stats = new Stats()
stats.setMode( 0 )
stats.domElement.classList.add( 'Stats' )

document.body.appendChild( stats.domElement )

export default stats
