import Stats from 'stats.js'

const parent = document.querySelector( '.js-Stats-container' )

export const stats = new Stats()
stats.setMode( 0 )
stats.domElement.classList.add( 'Stats' )
parent.appendChild( stats.domElement )

export const memstats = new Stats()
memstats.setMode( 2 )
memstats.domElement.classList.add( 'Stats' )
parent.appendChild( memstats.domElement )
