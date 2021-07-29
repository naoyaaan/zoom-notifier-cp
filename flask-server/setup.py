from setuptools import setup, find_packages

setup(
    name='app',
    packages=find_packages(),
    include_package_data=True,
    zip_safe=False,
    install_requires=[
        'flask==1.1.2',
        'flask-json==0.3.4',
        'pyjwt==2.0.1',
        'flask-sqlalchemy==2.4.4',
    ],
)
