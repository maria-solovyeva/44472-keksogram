function getMessage(a, b) {
	if (typeof a === 'boolean') {
		if (a===true) {
			return  'Переданное GIF-изображение анимировано и содержит ' + b + ' кадров';
		}
		else {
			return 'Переданное GIF-изображение не анимировано';
		}
	}
	if (typeof a === 'number') {
		return 'Переданное SVG-изображение содержит ' + a + ' объектов и '  + b * 4 + ' аттрибутов';
	}
		if (Array.isArray(a) && Array.isArray(b)) {
		var squareArray = 0;
		
		for (var i = 0; i < a.length; i++) {
			squareArray += a[i] * b[i];
		}
		
		return 'Общая площадь артефактов сжатия: ' + squareArray + ' пикселей';
	}

	if (Array.isArray(a)) {
		var sumArray = 0;
		
		for (var i = 0; i < a.length; i++) {
			sumArray += a[i];
		}
		return 'Количество красных точек во всех строчках изображения: ' + sumArray;
		
	}
}