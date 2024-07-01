from django import forms
from django.contrib.auth.forms import UserCreationForm, UserChangeForm
from .models import CustomUser
from django.core.exceptions import ValidationError

def validateRut(rut):
        last=rut[8]
        inverse=rut[7::-1]
        total=0
        for number in range(8):
            total+=int(inverse[number])*(number%6+2)
        rest=11-abs(total-11*(total//11))%11
        if(rest==10 and last=='k'):
            return None
        elif(rest==int(last)):
            return None
        else:
            if(rest==10):
                rest='k'
            raise ValidationError("Invalid identifier: Validation digit is "+str(last)+" and should be "+str(rest))

class CustomUserCreationForm(UserCreationForm):
    rut=forms.CharField(validators=[validateRut])
    class Meta:
        model = CustomUser
        fields = ('username', 'role', 'rut', 'institution', 'password1', 'password2')

class CustomUserChangeForm(UserChangeForm):
    rut=forms.CharField(validators=[validateRut])
    class Meta:
        model = CustomUser
        fields = ('username', 'role', 'rut', 'institution')