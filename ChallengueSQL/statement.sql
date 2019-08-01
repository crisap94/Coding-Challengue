SELECT nombre 
FROM codingchallengue.clientes
WHERE ClienteID IN (
	SELECT Cliente from codingchallengue.datos
	WHERE Cliente IN (
		SELECT Cliente FROM codingchallengue.datos
		WHERE Cliente IN (
			SELECT Cliente FROM codingchallengue.datos
			WHERE Valor = "Bogota"
		) 
        AND Valor = "SI"
	) 
    AND Valor = "F" 
);