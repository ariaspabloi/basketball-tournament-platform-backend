function transformArrays(foulsArray, pointsObject) {
  const combinedFouls = {};

  // Sumar las faltas de cada jugador
  foulsArray.forEach((fouls) => {
    for (const playerId in fouls) {
      if (combinedFouls[playerId]) {
        combinedFouls[playerId] += fouls[playerId];
      } else {
        combinedFouls[playerId] = fouls[playerId];
      }
    }
  });

  // Crear un nuevo array combinando las faltas y los puntos
  const result = [];
  for (const playerId in pointsObject) {
    result.push({
      id: parseInt(playerId),
      fouls: combinedFouls[playerId] || 0,
      points: pointsObject[playerId][0],
      doubleDoubles: pointsObject[playerId][1],
      threePointers: pointsObject[playerId][2],
    });
  }

  return result;
}

export default transformArrays;
