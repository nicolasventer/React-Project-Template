for file in *.d2; do
	fileNoExt="${file%.d2}"
	d2 "$fileNoExt.d2" "$fileNoExt.png"
done
